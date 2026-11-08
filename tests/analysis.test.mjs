import test from 'node:test';
import assert from 'node:assert/strict';
import {validateResult,imageMime,missing,textExport} from '../lib/analysis.mjs';
const original='Não use este medicamento em caso de alergia. Texto fotografado para teste.';
test('rejeita saída ilegível e estrutura inválida',()=>{for(const value of [null,{}, {original:'curto',name:'',sections:[]}])assert.throws(()=>validateResult(value))});
test('não aceita evidência inventada ou categoria ausente',()=>{const result=validateResult({name:'',original,sections:[{title:'Para que serve',text:'Cura tudo',evidence:'Cura tudo'}]});assert.equal(result.name,missing);assert.ok(result.sections.every(s=>s.text===missing))});
test('preserva trecho original e negação no contrato',()=>{const result=validateResult({name:'Teste',original,sections:[{title:'Contraindicações',text:'Não use em caso de alergia.',evidence:'Não use este medicamento em caso de alergia.'}]});assert.equal(result.sections[0].evidence,'Não use este medicamento em caso de alergia.');assert.match(textExport(result),/Não use/);assert.match(textExport(result),/Texto original extraído/)});
test('rejeita arquivos que apenas alegam ser imagens',()=>{assert.throws(()=>imageMime(new TextEncoder().encode('<svg onload=alert(1)>')));assert.equal(imageMime(new Uint8Array([255,216,255,0])),'image/jpeg');assert.equal(imageMime(new Uint8Array([137,80,78,71,13,10,26,10])),'image/png')});
