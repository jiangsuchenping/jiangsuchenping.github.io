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

  async init() {
    // Try to load from localStorage first
    const localData = localStorage.getItem('leave_system_db');
    if (localData) {
      this.db = JSON.parse(localData);
    } else {
      // Load from JSON files
      try {
        const [users, leaveTypes, entitlements, leaves] = await Promise.all([
          fetch('data/users.json').then(r => r.json()),
          fetch('data/leaveTypes.json').then(r => r.json()),
          fetch('data/entitlements.json').then(r => r.json()),
          fetch('data/leaves.json').then(r => r.json())
        ]);
        this.db = { users, leaveTypes, entitlements, leaves };
        this.save();
      } catch (e) {
        console.error('Failed to load initial data', e);
      }
    }
  },

  save() {
    localStorage.setItem('leave_system_db', JSON.stringify(this.db));
  },

  // Users
  getUsers() { return this.db.users; },
  getUser(id) { return this.db.users.find(u => u.id === id); },
  updateUser(userData) {
    const idx = this.db.users.findIndex(u => u.id === userData.id);
    if (idx > -1) {
      this.db.users[idx] = userData;
      this.save();
    }
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
  updateLeaveType(type) {
    const idx = this.db.leaveTypes.findIndex(t => t.id === type.id);
    if (idx > -1) {
      this.db.leaveTypes[idx] = type;
      this.save();
    }
  },

  // Entitlements
  getEntitlements(userId) {
    return this.db.entitlements.filter(e => e.userId === userId);
  },
  getEntitlement(userId, typeId) {
    return this.db.entitlements.find(e => e.userId === userId && e.leaveTypeId === typeId);
  },
  updateEntitlement(ent) {
    const idx = this.db.entitlements.findIndex(e => e.userId === ent.userId && e.leaveTypeId === ent.leaveTypeId);
    if (idx > -1) {
      this.db.entitlements[idx] = ent;
    } else {
      this.db.entitlements.push(ent);
    }
    this.save();
  }
};
window.API = API;
