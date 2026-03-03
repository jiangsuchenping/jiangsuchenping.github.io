/**
 * API Mock layer
 */
const API = {
  db: {
    users: [],
    leaveTypes: [],
    entitlements: [],
    leaves: []
  },

  dataPath: 'data/',

  async init(dataPath) {
    if (dataPath) this.dataPath = dataPath;
    // Try to load from localStorage first
    const localData = localStorage.getItem('leave_system_db');
    if (localData) {
      this.db = JSON.parse(localData);
    } else {
      // Load from JSON files
      await this.reloadFromMockData();
    }
  },

  /**
   * 从模拟数据文件重新加载数据到本地存储
   * 用于登录时刷新数据，确保显示最新的模拟数据
   */
  async reloadFromMockData() {
    try {
      const [users, leaveTypes, entitlements, leaves] = await Promise.all([
        fetch(`${this.dataPath}users.json`).then(r => r.json()),
        fetch(`${this.dataPath}leaveTypes.json`).then(r => r.json()),
        fetch(`${this.dataPath}entitlements.json`).then(r => r.json()),
        fetch(`${this.dataPath}leaves.json`).then(r => r.json())
      ]);
      this.db = { users, leaveTypes, entitlements, leaves };
      this.save();
      console.log('[API] 模拟数据已重新加载到本地存储');
    } catch (e) {
      console.error('[API] 重新加载模拟数据失败', e);
    }
  },

  save() {
    localStorage.setItem('leave_system_db', JSON.stringify(this.db));
  },

  // Users
  getUsers() { return this.db.users; },
  getUser(id) { return this.db.users.find(u => u.id === id); },
  saveUser(userData) {
    if (!userData.id) userData.id = 'u' + Date.now();
    const idx = this.db.users.findIndex(u => u.id === userData.id);
    if (idx > -1) {
      this.db.users[idx] = userData;
    } else {
      this.db.users.push(userData);
    }
    this.save();
    return userData;
  },

  // Leaves
  getLeaves() { return this.db.leaves; },
  getMyLeaves(userId) { return this.db.leaves.filter(l => l.userId === userId); },
  saveLeave(leave) {
    if (!leave.id) leave.id = 'lv' + Date.now();
    this.db.leaves.unshift(leave);
    this.save();
    return leave;
  },
  updateLeave(leave) {
    const idx = this.db.leaves.findIndex(l => l.id === leave.id);
    if (idx > -1) {
      this.db.leaves[idx] = leave;
      this.save();
    }
  },

  // Leave Types
  getLeaveTypes() { return this.db.leaveTypes; },
  saveLeaveType(type) {
    if (!type.id) type.id = 'lt' + Date.now();
    const idx = this.db.leaveTypes.findIndex(t => t.id === type.id);
    if (idx > -1) {
      this.db.leaveTypes[idx] = type;
    } else {
      this.db.leaveTypes.push(type);
    }
    this.save();
    return type;
  },

  // Entitlements
  // Get entitlements for a user
  getEntitlements(userId) {
    return this.db.entitlements.filter(e => e.userId === userId);
  },

  // Get the entitlement covering a specific date, or the latest unexpired one if no date provided
  getEntitlement(userId, typeId, date = null) {
    const list = this.db.entitlements.filter(e => e.userId === userId && e.leaveTypeId === typeId);
    if (!list.length) return null;

    if (date) {
      return list.find(e => date >= e.startDate && date <= e.endDate);
    }

    // Sort by endDate to find the most relevant (latest unexpired or upcoming)
    const now = new Date().toISOString().split('T')[0];
    const valid = list.filter(e => e.endDate >= now).sort((a, b) => a.startDate.localeCompare(b.startDate));
    return valid[0] || list.sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
  },
  updateEntitlement(ent) {
    const idx = this.db.entitlements.findIndex(e =>
      e.userId === ent.userId &&
      e.leaveTypeId === ent.leaveTypeId &&
      e.startDate === ent.startDate &&
      e.endDate === ent.endDate
    );

    // Check for overlaps if it's a new or modified period
    const overlaps = this.db.entitlements.some(e => {
      if (e.userId !== ent.userId || e.leaveTypeId !== ent.leaveTypeId) return false;
      // Skip the current one if we are updating by exact match (handled above, but let's be safe)
      if (e.startDate === ent.startDate && e.endDate === ent.endDate) return false;

      return (ent.startDate <= e.endDate && ent.endDate >= e.startDate);
    });

    if (overlaps) {
      throw new Error('额度范围与已有记录存在重叠');
    }

    if (idx > -1) {
      this.db.entitlements[idx] = ent;
    } else {
      this.db.entitlements.push(ent);
    }
    this.save();
  },

  getAllEntitlements() {
    return this.db.entitlements;
  },

  deleteEntitlement(ent) {
    this.db.entitlements = this.db.entitlements.filter(e =>
      !(e.userId === ent.userId && e.leaveTypeId === ent.leaveTypeId && e.startDate === ent.startDate)
    );
    this.save();
  }
};
window.API = API;
