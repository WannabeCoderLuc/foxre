# FoxRe // Open Fox Engine Interactive Documentation Portal

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Reverse%20Engineering-cyan.svg)](#)
[![Theme](https://img.shields.io/badge/UI-Interactive%20Hexagonal%20Honeycomb-00d2ff.svg)](#)

**FoxRe** is an independent, authoritative, binary-verified engineering wiki and interactive architectural portal for the [Fox Engine](https://en.wikipedia.org/wiki/Fox_Engine) (*Metal Gear Solid V: The Phantom Pain*, PC Steam v1.0.15.4 EN, base `0x140000000`).

Designed as an interactive web application featuring **hexagonal honeycomb navigation**, **dynamic Canvas mind maps**, **data tables with live search**, and **interactive calculators**, FoxRe bridges decades of community modding knowledge with low-level x64 reverse engineering ground truth.

---

## Quick Start / Local Preview

FoxRe is 100% self-contained with **zero external dependencies**.

### Windows One-Click Launch
Double-click `preview.bat` in this folder:
```cmd
preview.bat
```

### Python Command Line
```bash
python preview.py
```
This automatically starts a local HTTP server at `http://127.0.0.1:4000/` and opens your default browser.

---

## Interactive Features

### 1. Hexagonal Honeycomb Navigation
- **12 Primary Subsystem Hex Tiles** organized in an interlocking honeycomb layout (`clip-path: polygon(...)`).
- Clicking any tile instantly displays its verified architectural specification, vtable layouts, and binary addresses in a modal view.

### 2. Interactive System Mind Maps
- **Topological Canvas Flowcharts**:
  - **Engine Boot Cascade**: `WinMain` (`0x140003AA0`) &rarr; Kernel (`0x1400017C0`) &rarr; 12 Package Initializers &rarr; Master Loop (`0x140064560`).
  - **.fox2 Level Spawning Pipeline**: `DataSetFile2` &rarr; `EntityDef` (`ClassId`) &rarr; `TransformEntity` &rarr; `GameObjectLocator` &rarr; `ClassDescriptor::CreateInstance`.
  - **15-Part Actor Topology**: `Realizer`, `Life`, `Action`, `Damage`, `Sound`, `AI`, and `Notice` controller interconnects.

### 3. Live Data Tables & Registers
- Instant live search and column sorting across:
  - **514 Verified SendCommands**: Command names, 32-bit hashes, handler virtual addresses, and argument keys.
  - **792 Cracked Class Descriptors**: StrCode64 hashes, class names, and vtable addresses across the 1,491 registered descriptors.
  - **1,137 PE Fox Entity Classes**: ASCII class names extracted directly from `FUN_14007d210` callers in `.edata`.
  - **80 GameObject Types**: Actor type names, 7-bit type indices, and manager dispatch slots.

### 4. Interactive Calculators & Tools
- **Bidirectional 16-Bit GameObjectId Bitfield Calculator**: Convert between `(typeIndex << 9) | instanceIndex` and packed integer/hexadecimal identifiers.
- **ClassDescriptor 10-Slot Virtual Table Layout Reference**: Complete ABI breakdown for native C++ object instantiation and interface querying.

---

## Directory Layout

```
Community/FoxReWiki/
├── preview.bat              # One-click Windows preview launcher
├── preview.py               # Standalone Python HTTP preview server
├── index.html               # Main interactive portal application
├── css/
│   └── style.css            # Hexagonal honeycomb, high-tech dark theme (#0a0e17)
├── js/
│   ├── app.js               # Interactive canvas graphs, mind maps, search, calculators
│   └── wiki_database.js     # Standalone compiled JSON bundle (2.5 MB)
├── images/                  # Badges, diagrams, and media
└── content/                 # Community guides, file format specs, and research
```

---

## Rebuilding the Wiki Database

To recompile the latest reverse engineering discoveries into the web portal bundle:
```bash
python Tools/build_foxre_wiki.py
```
This re-indexes `mgsv_knowledge.db`, `strcode_bruteforced.tsv`, `cmd_handlers.tsv`, and all markdown research files into `js/wiki_database.js` in < 0.2 seconds.

---

## Credits & License
- **Core Engine Reverse Engineering & Architecture**: Project FoxRe team.
- **Upstream Modding Guides & Community Research**: Authors of the [MGSV Modding Wiki](https://github.com/mgsvmoddingwiki/mgsvmoddingwiki.github.io).
- Distributed under the MIT License.
