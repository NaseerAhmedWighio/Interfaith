import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
;(async () => {
  const qs = await p.assessmentQuestion.findMany({ orderBy: { orderIndex: 'asc' } })
  const texts = qs.map(q => q.questionText)
  const dups = texts.filter((t,i) => texts.indexOf(t) !== i)
  console.log('Total:', qs.length)
  console.log('Unique texts:', new Set(texts).size)
  console.log('All texts:', qs.map((q,i) => `${i}: ${q.questionText.slice(0,60)} [${q.id.slice(0,8)}]`).join('\n'))
  await p.$disconnect()
})()
