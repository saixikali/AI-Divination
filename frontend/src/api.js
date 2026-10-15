const API_BASE = ''

export async function getTypes() {
  const resp = await fetch(API_BASE + '/api/types')
  if (!resp.ok) throw new Error('无法获取占卜类型')
  return resp.json()
}

export async function postFortune(payload) {
  const resp = await fetch(API_BASE + '/api/fortune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(data.error || '占卜失败')
  return data
}
