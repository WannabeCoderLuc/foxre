---
title: ClassDescriptor ABI Specification
permalink: /Engine_Architecture/ClassDescriptor_ABI/
tags: [Engine, Architecture, ClassDescriptor, ABI, C++]
---

# The 10-Slot ClassDescriptor ABI Specification

Every gameplay component class in Fox Engine defines a static `ClassDescriptor` registered before `main()` via CRT initializers calling `0x140bff070(&descriptor)`.

```
ClassRegistry (_DAT_142c3a8a0)
  ├── vtable: 0x142308648
  ├── registeredCount: 1,491
  └── descriptors: ClassDescriptor*[2048]
```

## Virtual Method Table (10 Slots)

| Slot | Disp | Reference Function (`TppBuddyDog2`) | Role | Verified Implementation Details |
|---|---|---|---|---|
| **0** | `+0x00` | `0x140cc0b30` | `~ClassDescriptor()` | Deleting destructor for the descriptor object itself. |
| **1** | `+0x08` | `0x140c554c0` | `CreateInstance()` | **Instance Factory:** Allocates instance struct memory (`0x218` bytes) via `0x140bff0e0` (`Fox_AllocateMemory`, querying `QuarkSystemTable[1]` FoxMemorySystem), executes C++ constructor `0x140c551c0`, and sets runtime vtables (`0x142315d80`, `0x142315db0`). |
| **2** | `+0x10` | `0x141777540` | `DestroyInstance(inst)` | **Virtual Destructor Dispatcher:** Validates `inst != NULL` and invokes virtual scalar deleting destructor `(**inst->vtable)(inst, 1)`. |
| **3** | `+0x18` | `0x140c553c0` | `DestroyRaw(inst)` | **Direct Destructor:** Unwinds class vtables directly and invokes `0x140bff120(inst)` (`Fox_FreeMemory`). Used for non-virtual or cleanup deletion. |
| **4** | `+0x20` | `0x140c55bf0` | `SetupSystem(pSystem, pParams)` | **Component Binder:** Resolves all required actor controllers (`TppGameObjectInfo`, `TppBuddyDog2Realizer`, `TppBuddyDog2NoticeController`, `TppAiController`, etc.) via `QuarkSystemTable[0]->vtable[0]`. |
| **5** | `+0x28` | `0x140c58240` | `TeardownSystem(pSystem)` | **Component Unbinder:** Unregisters bound controllers from `QuarkSystemTable[0]` and frees subsystem buffers. |
| **6** | `+0x30` | `0x140c55a30` | `QueryInterface(uint64_t hash)` | Dynamic cast / interface locator. Compares `rdx` against class `StrCode64` (`0x0d6974413c33` = `"TppBuddyDog2"`). Returns adjusted pointer `rcx + 0x28` on match, or `0` on mismatch. |
| **7** | `+0x38` | `0x1400fe390` | `GetCategory(int32_t* outCat)` | Writes `-1` (`0xFFFFFFFF`) into output pointer across 1,418 classes, indicating standard un-categorized actor. |
| **8** | `+0x40` | `0x140c55990` | `GetDescriptorSingleton()` | Returns pointer to the static `ClassDescriptor` singleton in `.data2` (`0x142a9ab70`). |
| **9** | `+0x48` | `0x140c55980` | `GetSuperClass(void** outType)`| Writes superclass / base type-info pointer from `[inst + 0x1a0]` into `*outType`. |
