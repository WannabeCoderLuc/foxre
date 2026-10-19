---
title: QuarkSystemTable & Global Manager Architecture
permalink: /Engine_Architecture/QuarkSystemTable/
tags: [Engine, Architecture, Memory, Quark]
---

# QuarkSystemTable Subsystem Specification

`g_QuarkSystemTable` is a static 33-slot quadword array (`void* [33]`) at address `0x142c6c0c0` in the `.data2` section of `mgsvtpp.exe`.
Access by consumers is strictly mediated via `0x140bff050()` (`GetQuarkSystemTable`), while subsystem writers populate the table during boot via `FUN_141a43840()`.

## Verified Manager Slots (11,084 Engine Call Sites)

| Slot | Disp | Reads | Writer Function | Subsystem Name & Architecture |
|---|---|---|---|---|
| **0** | `+0x000` | 288 | `0x140bf2280` (`FoxQuark`) | `ComponentRegistry / ClassLookupService`: Master gameplay component factory locator. Dispatches `Lookup(StrCode64 hash)` to resolve component factories (`TppGameObjectInfo`, `TppAiController`, etc.). |
| **1** | `+0x008` | 272 | `0x140bf2280` (`FoxQuark`) | `FoxMemorySystem / HeapManager`: Global engine heap allocator. Accessed by `0x140bff0e0` (`Allocate`), `0x140bff120` (`Free`), and `0x140bff0a0` (`Realloc`). |
| **3** | `+0x018` | 71 | `0x141a4d680` | `OffenseTargetRegistry / PowerDamageSystem`: Combat offensive damage sensors and power hit-mask registration. |
| **4** | `+0x020` | 128 | `0x140bf34e0` | `NetworkUiManager / OnlineSaveState`: FOB security synchronization, online UI, and network gvars. |
| **5** | `+0x028` | 362 | `0x140bf2780` | `GameObjectLifecycleManager / LifeService`: Actor lifecycle orchestration (`SetMaxLife`, `Unrealize`, `Escape`, `SetCyprusMode`, `GetRidePlayer`). |
| **6** | `+0x030` | 9 | `0x140bf2780` | `SavedVarsManager / SVarsService`: High-level saved variables persistence (`RestoreFromSVars`, `ReadyToStoreToSVars`, `ChangeFova`). |
| **8** | `+0x040` | 169 | `0x1400f2130` | `TitleSaveDialogManager / SystemSaveService`: System save dialog state, delete confirmation, and title screen transitions. |
| **9** | `+0x048` | 30 | `0x140084e70` | `ActorRealizerManager / PauseSystem`: Realizer synchronization for complex multi-part boss actors (`TppSahelan2`, `TppBossQuiet2`, `TppVolgin2forVr`). |
| **12** | `+0x060` | 1,108 | `0x140bf3790` (`GameCore`) | `MessageBus / EventDispatcher`: **Master Engine Event Bus.** `vtable[8]` (`+0x40`) implements `RaiseMessage(uint32_t msgId, void* payload)`. Relays cross-subsystem events. |
| **13** | `+0x068` | 16 | `0x140bf3790` (`GameCore`) | `TowerAttackAlertManager / ScriptedSceneRealizer`: Scripted environmental scene destruction and tower collapse manager. |
| **14** | `+0x070` | 32 | `0x1401b2c10` | `MeshEquipAttachmentManager`: Headgear and character wearable mesh attachments (`Sunglasses`, `MESH_ROOT`, `Equip01`). |
| **15** | `+0x078` | 163 | `0x1403254a0` | `RouteAndAreaManager / DecoySystem`: Spatial patrol routes, CP area bounds, and tactical decoy simulation. |
| **16** | `+0x080` | 647 | `0x140bfde90` | `TppTargetManager / CollisionSystem`: Offense/defense BVH hit collision tree. Offense setup `vt[0x10]`, offense factory `vt[0x20]`, defense collector `vt[0x30]`. |
| **17** | `+0x088` | 345 | `0x140bfaf70` | `WormholeFobGimmickManager`: FOB wormhole teleportation and gimmick placement (`AbortFromWormhole`, `OutFromWormhole`). |
| **18** | `+0x090` | 1 | `0x140bfc940` | `DebugProfilerSlot`: Engine internal frame timing and profiling hook. |
| **19** | `+0x098` | 6,749 | `0x140bfde90` | `MasterGameContext / GlobalFlagsManager`: **Largest singleton in the engine.** Sub-tables: `+0x10` Options, `+0xE8` Combat/Sight perception context, `+0xF8` Stage Clock / Weather / Time, `+0x16F` Demo Mode flag. |
| **20** | `+0x0A0` | 34 | `0x141c997f0` | `NavigationSceneManager`: World navmesh binding and spatial navigation query interface (`SnapToNavmesh`). |
| **21** | `+0x0A8` | 348 | `0x1405150d0` | `SpatialAudioNoticeManager / NoiseSystem`: 3D sound perception system. `+0xA8 -> +0x08` = `NoiseSystem` (`AddNoise = (*NoiseSystem)[0]`). |
| **22** | `+0x0B0` | 69 | `0x14032a750` | `BoneSkeletonDamageManager`: Skeletal joint targeting and hitbox damage multipliers (`SKL_000_WAIST`, `SKL_043_RTOE`). |
| **23** | `+0x0B8` | 5 | `0x140435bf0` | `PhysicsSolverConstraintManager`: Rigid body / Havok physics constraint manager. |
| **24** | `+0x0C0` | 36 | `0x1404b4f90` | `SoundController / SoundService`: Native sound trigger playback and music cue service (`SoundControllerImpl_CallInternal`). |
| **25** | `+0x0C8` | 0* | `0x1404b6a50` | `RadioVoiceManager`: Scripted codec/radio speech queue. |
| **26** | `+0x0D0` | 3 | `0x140180490` | `UserStorageService`: Local and cloud savegame file I/O abstraction. |
| **27** | `+0x0D8` | 0* | `0x140180490` | `SaveDataCryptService`: Savegame encryption and hash checksum validation. |
| **28** | `+0x0E0` | 25 | `0x140422020` | `ShieldDefenseTargetManager`: Shield collision and directional ballistic deflector manager. |
| **29** | `+0x0E8` | 172 | `0x140084e70` | `HudUiManager / LayoutService`: HUD prompt icons, action markers, and screen layout compositor (`UI_hud_acticon_NG`). |
| **32** | `+0x100` | 2 | `0x1404bd300` | `InputManager / VirtualPadService`: DirectInput / XInput keyboard, mouse, and gamepad hardware binding. |
