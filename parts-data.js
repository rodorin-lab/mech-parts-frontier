// ============================================================
// MECH PARTS FRONTIER - パーツデータベース
// 設計書 Section 6, 7, 8, 29 準拠
// ============================================================

// スロット定義（設計書 Section 4.2 準拠）
var SLOTS = ['head', 'body', 'rightArm', 'leftArm', 'legs', 'backpack', 'weapon'];

// スロット日本語表示
var SLOT_JA = {
  head: '頭部',
  body: '胴体',
  rightArm: '右腕',
  leftArm: '左腕',
  legs: '脚部',
  backpack: 'バックパック',
  weapon: '武器'
};

// ============================================================
// パーツデータ（設計書 Section 6 のパーツ例 + Section 29.1 構造）
// 各パーツは色・形・性能を持ち、3D表示と性能計算に使用
// ============================================================

// === 頭部パーツ (Section 6.1) ===
var HEADS = {
  head_std_001: {
    id: 'head_std_001',
    name: '標準センサー頭部',
    desc: 'バランス型。命中率と索敵がそこそこ。',
    hp: 30, weight: 8,
    accuracy: 60, evasion: 5,
    color: 0x4488cc, emissive: 0x1144aa, emissiveIntensity: 0.4,
    shape: 'standard', // visor shape
    rarity: 'common'
  },
  head_sniper_001: {
    id: 'head_sniper_001',
    name: '高精度スナイパー頭部',
    desc: '命中精度が異常に高い。装甲薄い。',
    hp: 20, weight: 9,
    accuracy: 95, evasion: 2,
    color: 0x44ddaa, emissive: 0x22aa77, emissiveIntensity: 0.6,
    shape: 'sniper', // long scope
    rarity: 'rare'
  },
  head_radar_001: {
    id: 'head_radar_001',
    name: '広域レーダー頭部',
    desc: '索敵範囲広い。電子戦向き。',
    hp: 25, weight: 10,
    accuracy: 70, evasion: 4,
    color: 0xaa44ff, emissive: 0x6611cc, emissiveIntensity: 0.7,
    shape: 'radar', // dish on top
    rarity: 'rare'
  },
  head_ew_001: {
    id: 'head_ew_001',
    name: '電子戦用頭部',
    desc: 'EM耐性高。対電子戦特化。',
    hp: 22, weight: 11,
    accuracy: 65, evasion: 3,
    color: 0xff44aa, emissive: 0xaa1166, emissiveIntensity: 0.7,
    shape: 'standard',
    rarity: 'epic'
  },
  head_heavy_001: {
    id: 'head_heavy_001',
    name: '重装甲頭部',
    desc: 'HPと装甲が高い。鈍重。',
    hp: 50, weight: 18,
    accuracy: 55, evasion: 0,
    color: 0x888899, emissive: 0x444455, emissiveIntensity: 0.2,
    shape: 'heavy', // bulky
    rarity: 'uncommon'
  }
};

// === 胴体パーツ (Section 6.2) ===
var BODIES = {
  body_std_001: {
    id: 'body_std_001',
    name: '標準フレーム胴体',
    desc: 'バランス型。積載量普通。',
    hp: 100, armor: 20, weight: 30,
    enCap: 100, enRegen: 5,
    color: 0x3344aa, emissive: 0x112266, emissiveIntensity: 0.3,
    shape: 'standard',
    rarity: 'common'
  },
  body_light_001: {
    id: 'body_light_001',
    name: '軽量胴体',
    desc: '軽い。回避上がる。装甲薄い。',
    hp: 70, armor: 10, weight: 18,
    enCap: 90, enRegen: 6,
    color: 0x66aadd, emissive: 0x226699, emissiveIntensity: 0.4,
    shape: 'slim',
    rarity: 'uncommon'
  },
  body_heavy_001: {
    id: 'body_heavy_001',
    name: '重装甲胴体',
    desc: '硬い。重量アップ。',
    hp: 180, armor: 45, weight: 55,
    enCap: 120, enRegen: 3,
    color: 0x555566, emissive: 0x222233, emissiveIntensity: 0.2,
    shape: 'heavy',
    rarity: 'uncommon'
  },
  body_power_001: {
    id: 'body_power_001',
    name: '高出力コア胴体',
    desc: 'EN容量と回復がすごい。重い。',
    hp: 120, armor: 25, weight: 45,
    enCap: 180, enRegen: 10,
    color: 0xffaa22, emissive: 0xaa6600, emissiveIntensity: 0.8,
    shape: 'standard',
    rarity: 'rare'
  },
  body_repair_001: {
    id: 'body_repair_001',
    name: '修理支援胴体',
    desc: '自動修理ユニット内蔵。装甲普通。',
    hp: 110, armor: 22, weight: 35,
    enCap: 110, enRegen: 7,
    color: 0x22ff88, emissive: 0x118844, emissiveIntensity: 0.5,
    shape: 'standard',
    rarity: 'epic'
  }
};

// === 腕パーツ (Section 6.3) - 左右共通 ===
var ARMS = {
  arm_standard_001: {
    id: 'arm_standard_001',
    name: '標準多目的腕',
    desc: 'バランス型。武器汎用。',
    hp: 40, weight: 12,
    melee: 20, accuracy: 50,
    color: 0x4455aa, emissive: 0x223388, emissiveIntensity: 0.3,
    shape: 'standard',
    rarity: 'common'
  },
  arm_mg_001: {
    id: 'arm_mg_001',
    name: 'マシンガン内蔵腕',
    desc: '連射型。威力普通。',
    hp: 35, weight: 14,
    melee: 10, accuracy: 65,
    color: 0x888844, emissive: 0x444400, emissiveIntensity: 0.3,
    shape: 'gun', // bulky
    rarity: 'uncommon',
    weapon: { name: 'マシンガン', damage: 8, range: 6, fireRate: 8, ammo: 60, type: 'bullet' }
  },
  arm_cannon_001: {
    id: 'arm_cannon_001',
    name: 'キャノン腕',
    desc: '高威力単発。重い。',
    hp: 45, weight: 28,
    melee: 15, accuracy: 70,
    color: 0xaa6633, emissive: 0x663311, emissiveIntensity: 0.4,
    shape: 'cannon', // huge barrel
    rarity: 'rare',
    weapon: { name: 'キャノン砲', damage: 45, range: 10, fireRate: 1, ammo: 8, type: 'explosive' }
  },
  arm_blade_001: {
    id: 'arm_blade_001',
    name: 'ブレード腕',
    desc: '近接特化。高速斬撃。',
    hp: 38, weight: 10,
    melee: 65, accuracy: 0,
    color: 0xcc3344, emissive: 0x881122, emissiveIntensity: 0.7,
    shape: 'blade', // long blade
    rarity: 'rare'
  },
  arm_shield_001: {
    id: 'arm_shield_001',
    name: 'シールド腕',
    desc: '防御型。パリィ可能。',
    hp: 60, weight: 18,
    melee: 8, accuracy: 0,
    color: 0x4466aa, emissive: 0x224488, emissiveIntensity: 0.4,
    shape: 'shield', // shield mounted
    rarity: 'uncommon'
  }
};

// === 脚部パーツ (Section 6.5) ===
var LEGS = {
  legs_biped_001: {
    id: 'legs_biped_001',
    name: '標準二脚',
    desc: 'バランス型。',
    hp: 60, weight: 25,
    speed: 50, jump: 50, terrain: 'standard',
    color: 0x4455aa, emissive: 0x223388, emissiveIntensity: 0.3,
    shape: 'biped',
    rarity: 'common'
  },
  legs_reverse_001: {
    id: 'legs_reverse_001',
    name: '逆関節脚',
    desc: '高速移動。ジャンプ強い。',
    hp: 50, weight: 20,
    speed: 75, jump: 80, terrain: 'standard',
    color: 0xaa4488, emissive: 0x661144, emissiveIntensity: 0.4,
    shape: 'reverse', // reverse joint
    rarity: 'uncommon'
  },
  legs_tank_001: {
    id: 'legs_tank_001',
    name: 'タンク脚(キャタピラ)',
    desc: '重い。安定。ジャンプ不可。',
    hp: 120, weight: 60,
    speed: 30, jump: 0, terrain: 'all',
    color: 0x555566, emissive: 0x222233, emissiveIntensity: 0.2,
    shape: 'tank',
    rarity: 'uncommon'
  },
  legs_hover_001: {
    id: 'legs_hover_001',
    name: 'ホバー脚',
    desc: '浮遊。滑らかに移動。',
    hp: 45, weight: 15,
    speed: 65, jump: 100, terrain: 'all',
    color: 0x44ddcc, emissive: 0x118877, emissiveIntensity: 0.6,
    shape: 'hover',
    rarity: 'rare'
  },
  legs_heavy_001: {
    id: 'legs_heavy_001',
    name: '重量二脚',
    desc: '重いもの支える。鈍重。',
    hp: 90, weight: 45,
    speed: 35, jump: 30, terrain: 'standard',
    color: 0x666677, emissive: 0x333344, emissiveIntensity: 0.2,
    shape: 'biped',
    rarity: 'common'
  }
};

// === バックパック (Section 6.6) ===
var BACKPACKS = {
  bp_std_001: {
    id: 'bp_std_001',
    name: '標準ブースター',
    desc: '普通のブースト性能。',
    hp: 30, weight: 10,
    boost: 50, enCost: 5,
    color: 0x4455aa, emissive: 0x223388, emissiveIntensity: 0.4,
    shape: 'standard',
    rarity: 'common'
  },
  bp_highmob_001: {
    id: 'bp_highmob_001',
    name: '高機動ブースター',
    desc: '超高速。EN食い。',
    hp: 25, weight: 12,
    boost: 90, enCost: 12,
    color: 0xff4488, emissive: 0xaa1155, emissiveIntensity: 0.7,
    shape: 'thruster', // big thrusters
    rarity: 'rare'
  },
  bp_missile_001: {
    id: 'bp_missile_001',
    name: 'ミサイルポッド',
    desc: '追尾ミサイル装備。',
    hp: 35, weight: 20,
    boost: 30, enCost: 4,
    color: 0xcc4422, emissive: 0x661100, emissiveIntensity: 0.5,
    shape: 'missile', // pods
    rarity: 'rare',
    weapon: { name: 'ミサイル', damage: 30, range: 9, fireRate: 0.5, ammo: 12, type: 'explosive' }
  },
  bp_battery_001: {
    id: 'bp_battery_001',
    name: '追加バッテリー',
    desc: 'EN容量大幅増。重い。',
    hp: 28, weight: 18,
    boost: 40, enCost: 4,
    color: 0x22ddff, emissive: 0x1188aa, emissiveIntensity: 0.7,
    shape: 'battery',
    rarity: 'uncommon'
  },
  bp_shield_001: {
    id: 'bp_shield_001',
    name: 'シールドジェネレーター',
    desc: 'バリア展開可能。',
    hp: 32, weight: 16,
    boost: 35, enCost: 8,
    color: 0x44aaff, emissive: 0x2266cc, emissiveIntensity: 0.8,
    shape: 'shield',
    rarity: 'epic'
  }
};

// === 武器 (Section 22) - 独立装備スロット ===
var WEAPONS = {
  wpn_none: {
    id: 'wpn_none',
    name: '装備なし',
    desc: '武器を持たない。',
    hp: 0, weight: 0, attack: 0, accuracy: 0,
    color: 0x222222, emissive: 0x000000, emissiveIntensity: 0,
    shape: 'none',
    rarity: 'common'
  },
  wpn_rifle_001: {
    id: 'wpn_rifle_001',
    name: 'アサルトライフル',
    desc: '中距離万能。',
    hp: 10, weight: 8, attack: 22, accuracy: 70,
    color: 0x6688aa, emissive: 0x223344, emissiveIntensity: 0.4,
    shape: 'rifle',
    rarity: 'common'
  },
  wpn_shotgun_001: {
    id: 'wpn_shotgun_001',
    name: 'ショットガン',
    desc: '近距離高火力。',
    hp: 12, weight: 10, attack: 38, accuracy: 50,
    color: 0xaa7744, emissive: 0x553311, emissiveIntensity: 0.4,
    shape: 'shotgun',
    rarity: 'uncommon'
  },
  wpn_sniper_001: {
    id: 'wpn_sniper_001',
    name: 'スナイパーライフル',
    desc: '超長射程・高威力。',
    hp: 8, weight: 12, attack: 60, accuracy: 95,
    color: 0x44ff99, emissive: 0x11aa55, emissiveIntensity: 0.6,
    shape: 'sniper',
    rarity: 'rare'
  },
  wpn_laser_001: {
    id: 'wpn_laser_001',
    name: 'レーザー砲',
    desc: 'EN消費。弾数無限。',
    hp: 9, weight: 9, attack: 28, accuracy: 80, enCost: 8,
    color: 0xff2244, emissive: 0xcc0022, emissiveIntensity: 0.9,
    shape: 'laser',
    rarity: 'rare'
  }
};

// スロット別パーツ辞書マップ
var PARTS_DB = {
  head: HEADS,
  body: BODIES,
  rightArm: ARMS,
  leftArm: ARMS,
  legs: LEGS,
  backpack: BACKPACKS,
  weapon: WEAPONS
};

// ============================================================
// 初期機体（設計書 Section 21.1 アイアンワーカー準拠）
// ============================================================
var DEFAULT_LOADOUT = {
  head: 'head_std_001',
  body: 'body_std_001',
  rightArm: 'arm_mg_001',
  leftArm: 'arm_shield_001',
  legs: 'legs_biped_001',
  backpack: 'bp_std_001',
  weapon: 'wpn_rifle_001'
};
