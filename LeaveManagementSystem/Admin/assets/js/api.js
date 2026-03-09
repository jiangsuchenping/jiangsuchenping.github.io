/**
 * API 模拟层 (Mock API)
 * ============================================================
 * 本文件模拟后端数据接口，所有数据存储在 localStorage 中。
 * 首次加载时从 data/*.json 文件读取初始数据，之后的增删改均在
 * localStorage 中完成，刷新页面后数据持久保留。
 * 登录操作会重新从 JSON 文件加载最新的模拟数据，方便演示重置。
 * ============================================================
 */
const API = {
  /**
   * 内存数据库对象，包含四个核心集合：
   *   users        - 员工信息列表
   *   leaveTypes   - 假期类型配置列表
   *   entitlements - 员工假期额度列表（含周期）
   *   leaves       - 请假申请记录列表
   */
  db: {
    users: [],
    leaveTypes: [],
    entitlements: [],
    leaves: []
  },

  /** JSON 数据文件的相对路径前缀，可在 init() 中覆盖 */
  dataPath: 'data/',

  /**
   * 初始化 API：优先从 localStorage 恢复数据，若无则从 JSON 文件加载
   * @param {string} [dataPath] - 可选，指定 JSON 数据文件的目录路径
   */
  async init(dataPath) {
    if (dataPath) this.dataPath = dataPath;
    // 优先尝试从 localStorage 恢复之前保存的数据（支持离线持久化）
    const localData = localStorage.getItem('leave_system_db');
    if (localData) {
      this.db = JSON.parse(localData);
    } else {
      // localStorage 中没有数据时，从 JSON 文件加载初始模拟数据
      await this.reloadFromMockData();
    }
  },

  /**
   * 从模拟数据文件（data/*.json）重新加载所有数据并写入 localStorage
   * 主要用途：用户登录时调用，确保每次登录看到的是最新的演示数据；
   * 若需要"重置数据"，可清除 localStorage 后刷新页面。
   */
  async reloadFromMockData() {
    try {
      // 并行请求四个 JSON 文件，提升加载性能
      const [users, leaveTypes, entitlements, leaves] = await Promise.all([
        fetch(`${this.dataPath}users.json`).then(r => r.json()),
        fetch(`${this.dataPath}leaveTypes.json`).then(r => r.json()),
        fetch(`${this.dataPath}entitlements.json`).then(r => r.json()),
        fetch(`${this.dataPath}leaves.json`).then(r => r.json())
      ]);
      this.db = { users, leaveTypes, entitlements, leaves };
      this.save(); // 写入 localStorage，后续刷新页面无需再次发起网络请求
      console.log('[API] 模拟数据已重新加载到本地存储');
    } catch (e) {
      console.error('[API] 重新加载模拟数据失败', e);
    }
  },

  /**
   * 将当前内存数据库序列化并持久化到 localStorage
   * 每次数据变更（增/改/删）后必须调用此方法，否则刷新后数据丢失
   */
  save() {
    localStorage.setItem('leave_system_db', JSON.stringify(this.db));
  },

  // ============================================================
  // 员工（Users）相关接口
  // ============================================================

  /** 获取全部员工列表 */
  getUsers() { return this.db.users; },

  /**
   * 根据员工 ID 获取单个员工对象
   * @param {string} id - 员工唯一标识
   * @returns {Object|undefined} 员工对象，未找到时返回 undefined
   */
  getUser(id) { return this.db.users.find(u => u.id === id); },

  /**
   * 新增或更新员工信息（根据 id 是否存在判断）
   * @param {Object} userData - 员工数据对象；若 id 为空则自动生成
   * @returns {Object} 保存后的员工对象（含自动生成的 id）
   */
  saveUser(userData) {
    if (!userData.id) userData.id = 'u' + Date.now(); // 新增时自动生成唯一 ID
    const idx = this.db.users.findIndex(u => u.id === userData.id);
    if (idx > -1) {
      this.db.users[idx] = userData; // 已存在则原地替换（更新）
    } else {
      this.db.users.push(userData); // 不存在则追加（新增）
    }
    this.save();
    return userData;
  },

  // ============================================================
  // 请假申请（Leaves）相关接口
  // ============================================================

  /** 获取所有员工的全部请假记录 */
  getLeaves() { return this.db.leaves; },

  /**
   * 获取指定员工的请假记录
   * @param {string} userId - 员工 ID
   * @returns {Array} 属于该员工的请假记录数组
   */
  getMyLeaves(userId) { return this.db.leaves.filter(l => l.userId === userId); },

  /**
   * 新增一条请假申请记录
   * @param {Object} leave - 请假记录对象；若无 id 则自动生成
   * @returns {Object} 保存后的请假记录（含 id）
   */
  saveLeave(leave) {
    if (!leave.id) leave.id = 'lv' + Date.now();
    this.db.leaves.unshift(leave); // 插入到列表头部，使最新记录排在最前
    this.save();
    return leave;
  },

  /**
   * 更新指定请假记录（通常用于修改状态：Pending→Approved/Rejected，或编辑内容）
   * @param {Object} leave - 含有 id 的完整请假记录对象
   */
  updateLeave(leave) {
    const idx = this.db.leaves.findIndex(l => l.id === leave.id);
    if (idx > -1) {
      this.db.leaves[idx] = leave;
      this.save();
    }
  },

  // ============================================================
  // 假期类型（Leave Types）相关接口
  // ============================================================

  /** 获取全部假期类型配置列表 */
  getLeaveTypes() { return this.db.leaveTypes; },

  /**
   * 新增或更新假期类型配置
   * @param {Object} type - 假期类型对象；若无 id 则自动生成
   * @returns {Object} 保存后的假期类型对象
   */
  saveLeaveType(type) {
    if (!type.id) type.id = 'lt' + Date.now();
    const idx = this.db.leaveTypes.findIndex(t => t.id === type.id);
    if (idx > -1) {
      this.db.leaveTypes[idx] = type; // 更新已有类型
    } else {
      this.db.leaveTypes.push(type); // 新增类型
    }
    this.save();
    return type;
  },

  // ============================================================
  // 假期额度（Entitlements）相关接口
  // 额度记录由 (userId + leaveTypeId + startDate + endDate) 联合唯一标识
  // 一个员工同一假期类型可以有多个不同年度周期的额度记录
  // ============================================================

  /**
   * 获取指定员工的所有额度记录（不区分年度）
   * @param {string} userId - 员工 ID
   * @returns {Array} 该员工的额度记录数组
   */
  getEntitlements(userId) {
    return this.db.entitlements.filter(e => e.userId === userId);
  },

  /**
   * 获取指定员工、指定假期类型在某日期的有效额度记录
   * @param {string} userId  - 员工 ID
   * @param {string} typeId  - 假期类型 ID
   * @param {string|null} date - 可选，格式 'YYYY-MM-DD'；
   *   若提供：查找覆盖该日期的额度周期；
   *   若不提供：返回最近未过期的周期，或最后一条历史记录
   * @returns {Object|null} 匹配的额度记录，未找到返回 null
   */
  getEntitlement(userId, typeId, date = null) {
    const list = this.db.entitlements.filter(e => e.userId === userId && e.leaveTypeId === typeId);
    if (!list.length) return null;

    if (date) {
      // 按日期精确匹配：找到 startDate <= date <= endDate 的周期
      return list.find(e => date >= e.startDate && date <= e.endDate);
    }

    // 未指定日期时：找最近未过期的周期（按开始日期升序取第一个）
    const now = new Date().toISOString().split('T')[0];
    const valid = list.filter(e => e.endDate >= now).sort((a, b) => a.startDate.localeCompare(b.startDate));
    // 若没有未过期周期，则返回 endDate 最大的那条历史记录
    return valid[0] || list.sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
  },

  /**
   * 新增或更新一条额度记录
   * 更新规则：以 (userId + leaveTypeId + startDate + endDate) 四字段联合定位
   * 新增时：校验新周期与已有周期是否存在时间重叠，重叠则抛出错误
   * @param {Object} ent - 额度记录对象
   * @throws {Error} 若新周期与已有记录时间重叠
   */
  updateEntitlement(ent) {
    const idx = this.db.entitlements.findIndex(e =>
      e.userId === ent.userId &&
      e.leaveTypeId === ent.leaveTypeId &&
      e.startDate === ent.startDate &&
      e.endDate === ent.endDate
    );

    // 校验新周期是否与其他现有周期（非自身）发生时间重叠
    const overlaps = this.db.entitlements.some(e => {
      // 跳过不同员工或不同假期类型的记录
      if (e.userId !== ent.userId || e.leaveTypeId !== ent.leaveTypeId) return false;
      // 跳过与自身完全相同的记录（编辑场景）
      if (e.startDate === ent.startDate && e.endDate === ent.endDate) return false;
      // 判断两个日期区间是否有重叠：A.start <= B.end && A.end >= B.start
      return (ent.startDate <= e.endDate && ent.endDate >= e.startDate);
    });

    if (overlaps) {
      throw new Error('额度范围与已有记录存在重叠');
    }

    if (idx > -1) {
      this.db.entitlements[idx] = ent; // 更新已有记录
    } else {
      this.db.entitlements.push(ent); // 新增记录
    }
    this.save();
  },

  /** 获取所有员工的全部额度记录（HR管理视图使用） */
  getAllEntitlements() {
    return this.db.entitlements;
  },

  /**
   * 删除指定额度记录（以 userId + leaveTypeId + startDate 联合定位）
   * @param {Object} ent - 要删除的额度记录对象
   */
  deleteEntitlement(ent) {
    this.db.entitlements = this.db.entitlements.filter(e =>
      !(e.userId === ent.userId && e.leaveTypeId === ent.leaveTypeId && e.startDate === ent.startDate)
    );
    this.save();
  }
};

// 挂载到全局，方便其他模块直接使用 API.xxx()
window.API = API;
