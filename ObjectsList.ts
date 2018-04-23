import {ActiveCellObject} from "./Objects/ActiveCellObject";
import {Background} from "./Objects/Background";
import {BackgroundFar} from "./Objects/BackgroundFar";
import {Candle} from "./Objects/Candle";
import {CellObject} from "./Objects/CellObject";
import {ChainCreator} from "./Objects/ChainCreator";
import {ChestParticles} from "./Objects/ChestParticles";
import {DarkParticleSystem} from "./Objects/DarkParticleSystem";
import {DeathPoint} from "./Objects/DeathPoint";
import {Exit} from "./Objects/Exit";
import {FogParticleSystem} from "./Objects/FogParticleSystem";
import {JumpRock} from "./Objects/JumpRock";
import {Lighting2} from "./Objects/Lighting2";
import {Monster} from "./Objects/Monster";
import {ParticleSystem} from "./Objects/ParticleSystem";
import {Pawn} from "./Objects/Pawn";
import {Phys} from "./Objects/Phys";
import {Player} from "./Objects/Player";
import {Tower} from "./Objects/Tower";
import {TowerDeath} from "./Objects/TowerDeath";
import {TrickyPlate} from "./Objects/TrickyPlate";
import {Aligner} from "./Neu/BaseObjects/Aligner";
import {BaseParticleSystem} from "./Neu/BaseObjects/BaseParticleSystem";
import {Button} from "./Neu/BaseObjects/Button";
import {Camera} from "./Neu/BaseObjects/Camera";
import {ColorTextBox} from "./Neu/BaseObjects/ColorTextBox";
import {IO} from "./Neu/BaseObjects/IO";
import {Light} from "./Neu/BaseObjects/Light";
import {Lighting} from "./Neu/BaseObjects/Lighting";
import {O} from "./Neu/BaseObjects/O";
import {TextBox} from "./Neu/BaseObjects/TextBox";
import {TextBoxWorld} from "./Neu/BaseObjects/TextBoxWorld";
import {TextParticle} from "./Neu/BaseObjects/TextParticle";
import {Tooltip} from "./Neu/BaseObjects/Tooltip";
import {TrainEffect} from "./Neu/BaseObjects/TrainEffect";

export let ObjectNames = {
  ActiveCellObject :ActiveCellObject,
  Background :Background,
  BackgroundFar :BackgroundFar,
  Candle :Candle,
  CellObject :CellObject,
  ChainCreator :ChainCreator,
  ChestParticles :ChestParticles,
  DarkParticleSystem :DarkParticleSystem,
  DeathPoint :DeathPoint,
  Exit :Exit,
  FogParticleSystem :FogParticleSystem,
  JumpRock :JumpRock,
  Lighting2 :Lighting2,
  Monster :Monster,
  ParticleSystem :ParticleSystem,
  Pawn :Pawn,
  Phys :Phys,
  Player :Player,
  Tower :Tower,
  TowerDeath :TowerDeath,
  TrickyPlate :TrickyPlate,
  Aligner :Aligner,
  BaseParticleSystem :BaseParticleSystem,
  Button :Button,
  Camera :Camera,
  ColorTextBox :ColorTextBox,
  IO :IO,
  Light :Light,
  Lighting :Lighting,
  O :O,
  TextBox :TextBox,
  TextBoxWorld :TextBoxWorld,
  TextParticle :TextParticle,
  Tooltip :Tooltip,
  TrainEffect :TrainEffect,
};
export let LevelNames = [
  "levels/game.tmx",
  "levels/level1.tmx",
  "levels/level2.tmx",
  "levels/level3.tmx",
  "levels/level4.tmx",
  "levels/menu.tmx",
  "levels/tileset.tsx",
];