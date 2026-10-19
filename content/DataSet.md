---
title: DataSet
permalink: /DataSet/
tags: [Entities, Reference, File Formats]
redirect_from:
  - "/FOX2"
---

DataSet / DataSet2 entities are represented as .fox2 files.
It contains a list of every entity used in that particular dataset, presumably used as a
table referenced by the editor to enumerate the various objects placed therein.

## Usage

Header:

```xml
<entity class="DataSet" classVersion="0" addr="0x02D7DFA0" unknown1="232" unknown2="89171">
 ```

See the verified C++ ground-truth table below for the exact roles of `addr`, `unknown1` (`ClassId`), and `unknown2` (`InstanceAddress`).

Following the header block are three property blocks: *name*, *dataSet*,
and *dataList*.

*name* follows the following convention and is usually left empty in a
**DataSet**:

```xml
<property name="name" type="String" container="StaticArray" arraySize="1">
  <value></value>
</property>
```

Following *name* is *dataSet*, a property common to all Fox entities. As
a **DataSet** entity is necessarily not contained by itself or another
**DataSet**, this field is usually zeroed, like so:

```xml
<property name="dataSet" type="EntityHandle" container="StaticArray" arraySize="1">
  <value>0x00000000</value>
</property>
```

The *value* subblock is a pointer to the **DataSet** entity, if this
entity belongs to a **DataSet**. Typically you may acquire the value of
this field by observing the *addr* property in the header block of the
**DataSet**. It should be the same for all entities in the .fox2.

Following *dataSet* is *dataList*, which is the property block that
actually contains the list of entities used in a given .fox2. It has a
format like the following:

```xml
<property name="dataList" type="EntityPtr" container="StringMap" arraySize="2">
  <value key="cypr_location">0x02D7E010</value>
  <value key="TexturePackLoadConditioner0000">0x0827ADC0</value>
</property>
```

Each value block contains one property, *key*, which is equivalent to
the *name* static property of the given entity. The value itself is a
pointer to that entity, given by the *addr** header block property of
that given entity.

The size of the **DataSet** is variable, depending on the number of
entries listed in *dataList*.



## Header & EntityDef Ground Truth (x64 Decoded)

In retail `mgsvtpp.exe`, every `.fox2` entity binary definition follows the 64-byte `EntityDef` specification decoded in Milestone 2:

```xml
<entity class="DataSet" classVersion="0" addr="0x02D7DFA0" unknown1="232" unknown2="89171">
```

| Field Name | Type | x64 Verified Role & Engine Implementation |
|---|---|---|
| `class` | `string` | C++ entity class name. Matches the ASCII string registered at engine boot via `FUN_14007d210`. |
| `classVersion`| `uint16` | Schema version code passed to `FUN_140074c90` during entity class initialization. |
| `addr` | `uint32` | Relative byte displacement within the `.fox2` buffer. Used by pointer fixup routines to resolve `FoxEntityPtr` and `FoxEntityHandle` references without runtime string lookups. |
| `unknown1` | `uint16` | **`ClassId`**: 16-bit registered type index in Fox Engine's global entity registry. Initialized during engine boot by `FUN_140074c90(pInfo, size, pSuper, version)`. |
| `unknown2` | `uint32` | **`InstanceAddress`**: 32-bit instance heap offset allocated during `CreateInstance` by `Fox_AllocateMemory` (`0x140bff0e0`) via `QuarkSystemTable + 0x08` (`FoxMemorySystem`). |

### FoxDataType Specification (Byte 0x08 of PropertyDef)
Verified from `FoxCore` reflection headers:

| ID | Data Type | ID | Data Type | ID | Data Type |
|---|---|---|---|---|---|
| `0` | `FoxInt8` | `9` | `FoxDouble` | `18` | `FoxMatrix4` |
| `1` | `FoxUInt8` | `10` | `FoxBool` | `19` | `FoxColor` |
| `2` | `FoxInt16` | `11` | `FoxString` (StrCode64) | `20` | `FoxFilePtr` |
| `3` | `FoxUInt16` | `12` | `FoxPath` (PathCode64) | `21` | `FoxEntityHandle` |
| `4` | `FoxInt32` | `13` | `FoxEntityPtr` | `22` | `FoxEntityLink` |
| `5` | `FoxUInt32` | `14` | `FoxVector3` | `23` | `FoxPropertyInfo` |
| `6` | `FoxInt64` | `15` | `FoxVector4` | `24` | `FoxWideVector3` |
| `7` | `FoxUInt64` | `16` | `FoxQuat` (Quaternion) | | |
| `8` | `FoxFloat` | `17` | `FoxMatrix3` | | |

### FoxContainerType Specification (Byte 0x09 of PropertyDef)
| ID | Container Type | Description |
|---|---|---|
| `0` | `StaticArray` | Fixed-size continuous array embedded directly in the property payload. |
| `1` | `DynamicArray` | Resizable heap vector managed by `FoxMemorySystem`. |
| `2` | `StringMap` | Key-value associative map keyed by 64-bit CityHash strings. |
| `3` | `List` | Doubly-linked entity list. |

## FoxDataType Specification (Byte 0x08 of PropertyDef)
Verified from `FoxCore` reflection headers:

| ID | Data Type | ID | Data Type | ID | Data Type |
|---|---|---|---|---|---|
| `0` | `FoxInt8` | `9` | `FoxDouble` | `18` | `FoxMatrix4` |
| `1` | `FoxUInt8` | `10` | `FoxBool` | `19` | `FoxColor` |
| `2` | `FoxInt16` | `11` | `FoxString` (StrCode64) | `20` | `FoxFilePtr` |
| `3` | `FoxUInt16` | `12` | `FoxPath` (PathCode64) | `21` | `FoxEntityHandle` |
| `4` | `FoxInt32` | `13` | `FoxEntityPtr` | `22` | `FoxEntityLink` |
| `5` | `FoxUInt32` | `14` | `FoxVector3` | `23` | `FoxPropertyInfo` |
| `6` | `FoxInt64` | `15` | `FoxVector4` | `24` | `FoxWideVector3` |
| `7` | `FoxUInt64` | `16` | `FoxQuat` (Quaternion) | | |
| `8` | `FoxFloat` | `17` | `FoxMatrix3` | | |

### FoxContainerType Specification (Byte 0x09 of PropertyDef)
| ID | Container Type | Description |
|---|---|---|
| `0` | `StaticArray` | Fixed-size continuous array embedded directly in the property payload. |
| `1` | `DynamicArray` | Resizable heap vector managed by `FoxMemorySystem`. |
| `2` | `StringMap` | Key-value associative map keyed by 64-bit CityHash strings. |
| `3` | `List` | Doubly-linked entity list. |

## FoxDataType Specification (Byte 0x08 of PropertyDef)
Verified from `FoxCore` reflection headers:

| ID | Data Type | ID | Data Type | ID | Data Type |
|---|---|---|---|---|---|
| `0` | `FoxInt8` | `9` | `FoxDouble` | `18` | `FoxMatrix4` |
| `1` | `FoxUInt8` | `10` | `FoxBool` | `19` | `FoxColor` |
| `2` | `FoxInt16` | `11` | `FoxString` (StrCode64) | `20` | `FoxFilePtr` |
| `3` | `FoxUInt16` | `12` | `FoxPath` (PathCode64) | `21` | `FoxEntityHandle` |
| `4` | `FoxInt32` | `13` | `FoxEntityPtr` | `22` | `FoxEntityLink` |
| `5` | `FoxUInt32` | `14` | `FoxVector3` | `23` | `FoxPropertyInfo` |
| `6` | `FoxInt64` | `15` | `FoxVector4` | `24` | `FoxWideVector3` |
| `7` | `FoxUInt64` | `16` | `FoxQuat` (Quaternion) | | |
| `8` | `FoxFloat` | `17` | `FoxMatrix3` | | |

### FoxContainerType Specification (Byte 0x09 of PropertyDef)
| ID | Container Type | Description |
|---|---|---|
| `0` | `StaticArray` | Fixed-size continuous array embedded directly in the property payload. |
| `1` | `DynamicArray` | Resizable heap vector managed by `FoxMemorySystem`. |
| `2` | `StringMap` | Key-value associative map keyed by 64-bit CityHash strings. |
| `3` | `List` | Doubly-linked entity list. |
