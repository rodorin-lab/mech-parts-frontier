// ============================================================
// MECH PARTS FRONTIER - 3D Mech Builder
// 部位ごとにパーツから3Dメッシュを合成（設計書 Section 28.2）
// ============================================================

// メカグループを作成（全パーツを子に持つ）
function buildMech(loadout) {
  var mechGroup = new THREE.Group();
  mechGroup.userData = { type: 'mech' };

  // === 胴体 (中心) ===
  var body = PARTS_DB.body[loadout.body];
  if (body) {
    var bodyMesh = buildBody(body);
    mechGroup.add(bodyMesh);
  }

  // === 頭部 (胴体の上) ===
  var head = PARTS_DB.head[loadout.head];
  if (head) {
    var headMesh = buildHead(head);
    headMesh.position.y = 1.4;
    mechGroup.add(headMesh);
  }

  // === コア (胸のエミッシブ発光体) ===
  var coreGeo = new THREE.SphereGeometry(0.18, 12, 12);
  var coreMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 2.5
  });
  var core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0.4, 0.55);
  mechGroup.add(core);
  mechGroup.userData.core = core;

  // === 腕 ===
  var rArm = PARTS_DB.rightArm[loadout.rightArm];
  if (rArm) {
    var rArmGroup = buildArm(rArm);
    rArmGroup.position.set(1.0, 0.3, 0);
    mechGroup.add(rArmGroup);
  }
  var lArm = PARTS_DB.leftArm[loadout.leftArm];
  if (lArm) {
    var lArmGroup = buildArm(lArm);
    lArmGroup.position.set(-1.0, 0.3, 0);
    lArmGroup.rotation.y = Math.PI;
    mechGroup.add(lArmGroup);
  }

  // === 脚 ===
  var legs = PARTS_DB.legs[loadout.legs];
  if (legs) {
    var legsGroup = buildLegs(legs);
    legsGroup.position.y = -1.0;
    mechGroup.add(legsGroup);
  }

  // === バックパック (背後) ===
  var bp = PARTS_DB.backpack[loadout.backpack];
  if (bp) {
    var bpGroup = buildBackpack(bp);
    bpGroup.position.set(0, 0.3, -0.55);
    mechGroup.add(bpGroup);
  }

  // === 武器 (右手に保持 or 背中にマウント) ===
  var wpn = PARTS_DB.weapon[loadout.weapon];
  if (wpn && wpn.shape !== 'none') {
    var wpnMesh = buildWeapon(wpn);
    wpnMesh.position.set(0.55, 0.3, 0.85);
    wpnMesh.rotation.x = -0.3;
    mechGroup.add(wpnMesh);
  }

  return mechGroup;
}

// ============================================================
// 部位別ビルダー
// ============================================================

function buildHead(headData) {
  var group = new THREE.Group();

  // 基本形
  var geo = new THREE.BoxGeometry(0.7, 0.55, 0.6);
  var mat = new THREE.MeshStandardMaterial({
    color: headData.color,
    emissive: headData.emissive,
    emissiveIntensity: headData.emissiveIntensity,
    metalness: 0.7,
    roughness: 0.3
  });
  var main = new THREE.Mesh(geo, mat);
  main.castShadow = true;
  group.add(main);

  // バイザー(visor)
  var visorMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 1.8
  });
  var visor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.08), visorMat);
  visor.position.set(0, 0.05, 0.32);
  group.add(visor);

  // 形状別追加
  if (headData.shape === 'sniper') {
    // スコープ
    var scope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.9 })
    );
    scope.rotation.z = Math.PI / 2;
    scope.position.set(0, 0.2, 0.35);
    group.add(scope);
  } else if (headData.shape === 'radar') {
    // 上のレーダーディッシュ
    var dish = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: headData.color, metalness: 0.8, side: THREE.DoubleSide })
    );
    dish.position.set(0, 0.4, 0);
    group.add(dish);
    // アンテナ
    var antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.4),
      new THREE.MeshStandardMaterial({ color: headData.color, emissive: headData.emissive, emissiveIntensity: 0.6 })
    );
    antenna.position.set(0.2, 0.5, 0);
    group.add(antenna);
  } else if (headData.shape === 'heavy') {
    // 重装甲：かさ増し
    var armor = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.3, 0.7),
      new THREE.MeshStandardMaterial({ color: headData.color, metalness: 0.8, roughness: 0.4 })
    );
    armor.position.set(0, -0.1, 0);
    group.add(armor);
  }

  group.userData = { type: 'head', data: headData };
  return group;
}

function buildBody(bodyData) {
  var group = new THREE.Group();

  var geo, mat;
  if (bodyData.shape === 'slim') {
    geo = new THREE.BoxGeometry(0.95, 1.4, 0.65);
  } else if (bodyData.shape === 'heavy') {
    geo = new THREE.BoxGeometry(1.3, 1.5, 0.85);
  } else {
    geo = new THREE.BoxGeometry(1.1, 1.4, 0.75);
  }
  mat = new THREE.MeshStandardMaterial({
    color: bodyData.color,
    emissive: bodyData.emissive,
    emissiveIntensity: bodyData.emissiveIntensity,
    metalness: 0.85,
    roughness: 0.25
  });
  var main = new THREE.Mesh(geo, mat);
  main.castShadow = true;
  group.add(main);

  // 肩アーマー
  var shoulderMat = new THREE.MeshStandardMaterial({
    color: bodyData.color,
    emissive: bodyData.emissive,
    emissiveIntensity: bodyData.emissiveIntensity * 0.6,
    metalness: 0.9
  });
  var rShoulder = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.55), shoulderMat);
  rShoulder.position.set(0.7, 0.45, 0);
  group.add(rShoulder);
  var lShoulder = rShoulder.clone();
  lShoulder.position.set(-0.7, 0.45, 0);
  group.add(lShoulder);

  // 腰
  var waist = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.3, 0.65),
    shoulderMat
  );
  waist.position.y = -0.85;
  group.add(waist);

  group.userData = { type: 'body', data: bodyData };
  return group;
}

function buildArm(armData) {
  var group = new THREE.Group();

  var mainMat = new THREE.MeshStandardMaterial({
    color: armData.color,
    emissive: armData.emissive,
    emissiveIntensity: armData.emissiveIntensity,
    metalness: 0.85,
    roughness: 0.3
  });

  // 形状別
  if (armData.shape === 'cannon') {
    // 巨大な砲身
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), mainMat);
    group.add(base);
    var barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 1.4, 10),
      new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.95 })
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0, 0.7);
    group.add(barrel);
    // マズル
    var muzzle = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.04, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff6600, emissiveIntensity: 1.2 })
    );
    muzzle.position.set(0, 0, 1.4);
    muzzle.rotation.y = Math.PI / 2;
    group.add(muzzle);
  } else if (armData.shape === 'blade') {
    // 腕
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), mainMat);
    group.add(base);
    // 刀身
    var blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.0, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xdd3344, emissive: 0xaa1122, emissiveIntensity: 0.6, metalness: 1 })
    );
    blade.position.set(0, 0.7, 0.3);
    group.add(blade);
    // 刃先端
    var tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.3, 4),
      new THREE.MeshStandardMaterial({ color: 0xff5566, emissive: 0xff2233, emissiveIntensity: 1.0 })
    );
    tip.position.set(0, 1.3, 0.3);
    group.add(tip);
  } else if (armData.shape === 'shield') {
    // 腕
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), mainMat);
    group.add(base);
    // シールド
    var shield = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.7, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x4488cc, emissive: 0x224488, emissiveIntensity: 0.5, metalness: 0.9 })
    );
    shield.position.set(0, 0, 0.35);
    group.add(shield);
    // シールド発光ライン
    var line = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.05, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5 })
    );
    line.position.set(0, 0.2, 0.36);
    group.add(line);
  } else if (armData.shape === 'gun') {
    // ガトリング
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.35), mainMat);
    group.add(base);
    var gunBarrels = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.95 })
    );
    gunBarrels.rotation.x = Math.PI / 2;
    gunBarrels.position.set(0, 0, 0.5);
    group.add(gunBarrels);
  } else {
    // 標準腕
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), mainMat);
    group.add(base);
    var fist = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.3), mainMat);
    fist.position.set(0, -0.35, 0.05);
    group.add(fist);
  }

  group.userData = { type: 'arm', data: armData };
  return group;
}

function buildLegs(legsData) {
  var group = new THREE.Group();

  var mainMat = new THREE.MeshStandardMaterial({
    color: legsData.color,
    emissive: legsData.emissive,
    emissiveIntensity: legsData.emissiveIntensity,
    metalness: 0.85,
    roughness: 0.3
  });

  if (legsData.shape === 'tank') {
    // キャタピラ
    var tread = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.5, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.9 })
    );
    tread.position.y = -0.3;
    group.add(tread);
    // 車輪
    for (var i = -1; i <= 1; i++) {
      var wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.15, 12),
        new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.95 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(i * 0.5, -0.5, 0.3);
      group.add(wheel);
      var wheel2 = wheel.clone();
      wheel2.position.z = -0.3;
      group.add(wheel2);
    }
  } else if (legsData.shape === 'hover') {
    // 浮遊：下半分は光輪
    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.3, 0.6, 8),
      mainMat
    );
    base.position.y = -0.4;
    group.add(base);
    // 左右
    var leftPod = base.clone();
    leftPod.position.x = -0.35;
    group.add(leftPod);
    var rightPod = base.clone();
    rightPod.position.x = 0.35;
    group.add(rightPod);
    // 光輪
    var glowMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.8, transparent: true, opacity: 0.6
    });
    var glow = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.32, 16), glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.75;
    group.add(glow);
  } else if (legsData.shape === 'reverse') {
    // 逆関節：膝が後ろに
    var thighL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.3), mainMat);
    thighL.position.set(-0.3, 0, 0);
    group.add(thighL);
    var shinL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.25), mainMat);
    shinL.position.set(-0.3, -0.6, -0.15);
    shinL.rotation.x = 0.3;
    group.add(shinL);
    var footL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.5), mainMat);
    footL.position.set(-0.3, -1.0, 0.15);
    group.add(footL);
    // 反対側
    var thighR = thighL.clone(); thighR.position.x = 0.3; group.add(thighR);
    var shinR = shinL.clone(); shinR.position.x = 0.3; group.add(shinR);
    var footR = footL.clone(); footR.position.x = 0.3; group.add(footR);
  } else {
    // 標準二脚
    var legL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), mainMat);
    legL.position.set(-0.3, -0.5, 0);
    group.add(legL);
    var legR = legL.clone();
    legR.position.x = 0.3;
    group.add(legR);
    var footL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.5), mainMat);
    footL.position.set(-0.3, -1.05, 0.1);
    group.add(footL);
    var footR = footL.clone();
    footR.position.x = 0.3;
    group.add(footR);
  }

  group.userData = { type: 'legs', data: legsData };
  return group;
}

function buildBackpack(bpData) {
  var group = new THREE.Group();

  var mainMat = new THREE.MeshStandardMaterial({
    color: bpData.color,
    emissive: bpData.emissive,
    emissiveIntensity: bpData.emissiveIntensity,
    metalness: 0.85,
    roughness: 0.3
  });

  if (bpData.shape === 'thruster') {
    // 大きなスラスター
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.4), mainMat);
    group.add(base);
    var nozzleL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.28, 0.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.95 })
    );
    nozzleL.rotation.x = Math.PI / 2;
    nozzleL.position.set(-0.3, 0, -0.4);
    group.add(nozzleL);
    var nozzleR = nozzleL.clone();
    nozzleR.position.x = 0.3;
    group.add(nozzleR);
    // ノズル内側発光
    var glowMat = new THREE.MeshStandardMaterial({
      color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 2.0
    });
    var glowL = new THREE.Mesh(new THREE.CircleGeometry(0.16, 12), glowMat);
    glowL.rotation.y = Math.PI;
    glowL.position.set(-0.3, 0, -0.65);
    group.add(glowL);
    var glowR = glowL.clone();
    glowR.position.x = 0.3;
    group.add(glowR);
  } else if (bpData.shape === 'missile') {
    // ミサイルポッド
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.3), mainMat);
    group.add(base);
    for (var i = 0; i < 4; i++) {
      var missile = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6),
        new THREE.MeshStandardMaterial({ color: 0xaa3322, emissive: 0x661100, emissiveIntensity: 0.4 })
      );
      missile.rotation.x = Math.PI / 2;
      missile.position.set(i < 2 ? -0.25 : 0.25, (i % 2 === 0 ? 0.25 : -0.25), -0.2);
      group.add(missile);
    }
  } else if (bpData.shape === 'battery') {
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.4), mainMat);
    group.add(base);
    // 発光ライン
    for (var j = 0; j < 3; j++) {
      var line = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.06, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5 })
      );
      line.position.y = -0.3 + j * 0.3;
      line.position.z = 0.21;
      group.add(line);
    }
  } else if (bpData.shape === 'shield') {
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.3), mainMat);
    group.add(base);
    // シールド発光円
    var disc = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x44aaff, emissive: 0x44aaff, emissiveIntensity: 1.0, transparent: true, opacity: 0.5 })
    );
    disc.position.set(0, 0, 0.16);
    group.add(disc);
  } else {
    // 標準
    var base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.35), mainMat);
    group.add(base);
    // 小さいノズル
    var noz = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.95 })
    );
    noz.rotation.x = Math.PI / 2;
    noz.position.set(0, 0, -0.3);
    group.add(noz);
  }

  group.userData = { type: 'backpack', data: bpData };
  return group;
}

function buildWeapon(wpnData) {
  var group = new THREE.Group();

  if (wpnData.shape === 'none') return group;

  var mat = new THREE.MeshStandardMaterial({
    color: wpnData.color,
    emissive: wpnData.emissive,
    emissiveIntensity: wpnData.emissiveIntensity,
    metalness: 0.9,
    roughness: 0.25
  });

  if (wpnData.shape === 'rifle') {
    var body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.9), mat);
    group.add(body);
    var grip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), mat);
    grip.position.set(0, -0.18, -0.1);
    group.add(grip);
  } else if (wpnData.shape === 'shotgun') {
    var body = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 1.0), mat);
    group.add(body);
    var barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), mat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0, 0.5);
    group.add(barrel);
  } else if (wpnData.shape === 'sniper') {
    var body = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 1.2), mat);
    group.add(body);
    var scope = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8), mat);
    scope.rotation.z = Math.PI / 2;
    scope.position.set(0, 0.15, 0.1);
    group.add(scope);
  } else if (wpnData.shape === 'laser') {
    var body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.85), mat);
    group.add(body);
    var emitter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.08, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xff2244, emissive: 0xff0022, emissiveIntensity: 2.0 })
    );
    emitter.rotation.x = Math.PI / 2;
    emitter.position.set(0, 0, 0.5);
    group.add(emitter);
  }

  group.userData = { type: 'weapon', data: wpnData };
  return group;
}
