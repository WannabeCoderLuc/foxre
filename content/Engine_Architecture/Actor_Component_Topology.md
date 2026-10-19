---
title: Actor-Component Modular Topology
permalink: /Engine_Architecture/Actor_Component_Topology/
tags: [Engine, Architecture, Actors, Components, AI]
---

# Modular Actor-Component Topology

Fox Engine structures every gameplay actor into a standardized, modular set of component descriptors:

```
[Actor Type] (e.g. TppBossQuiet2, TppBuddyDog2, TppSoldier2, TppVolgin2forVr)
  ├── <Actor>Realizer              (Model & resource streaming / realization)
  ├── <Actor>RealizerController    (Realization scheduling & state)
  ├── <Actor>LifeController        (HP, stamina, wounds, dying state)
  ├── <Actor>NoticeController      (Sensory perception: sight, hearing, noise checks)
  ├── <Actor>DiscoveryController   (Target identification & hostile awareness)
  ├── <Actor>ActionController      (Command queue, motion requests, animation links)
  ├── <Actor>DamageHandler         (Hitbox damage intake, armor reduction, stagger)
  ├── <Actor>StateCollector        (Per-frame status aggregation for AI decision)
  ├── <Actor>FlagInfo              (Bitmask flags: realized, asleep, alert, etc.)
  ├── <Actor>SoundController       (Voice, footsteps, weapon audio playback)
  ├── <Actor>Core / <Actor>CoreAi  (Base state machine & AI coordination)
  ├── <Actor>ActionCore            (Low-level motion executor)
  └── Per-Phase AI Nodes:
        ├── <Actor>SneakAi         (Idle / patrol routines)
        ├── <Actor>CautionAi       (Investigate noise / search area)
        ├── <Actor>CombatAi        (Attack selection, weapon firing, tactical reposition)
        ├── <Actor>AlertAi         (Engaged combat state)
        ├── <Actor>SleepAi         (Tranquilized / knocked unconscious)
        └── <Actor>DeadAi          (Fatal death animation & physics ragdoll transition)
```
