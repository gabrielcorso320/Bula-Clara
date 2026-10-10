import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')

test('abre a demonstração sem autenticação', () => {
  assert.doesNotMatch(page, /type Screen=.*login/i)
  assert.doesNotMatch(page, /function Login/)
  assert.doesNotMatch(page, /function Register/)
})

test('cobre o fluxo principal definido no documento', () => {
  for (const label of [
    'Abrir câmera',
    'Enviar imagem',
    'Pré-visualização',
    'Para que serve',
    'Contraindicações',
    'Cuidados e advertências',
    'Possíveis efeitos adversos',
    'Texto original',
    'Comparar',
    'Nova consulta',
    'Encerrar consulta',
  ]) assert.match(page, new RegExp(label, 'i'))
})

test('oferece acessibilidade, áudio e exportação demonstrativa', () => {
  for (const label of ['Diminuir texto', 'Aumentar texto', 'Alto contraste', 'Ouvir resumo', 'PDF', 'TXT', 'MP3']) {
    assert.match(page, new RegExp(label, 'i'))
  }
})
