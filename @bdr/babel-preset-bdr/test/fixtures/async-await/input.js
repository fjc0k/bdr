function fetch() {
  return [{ name: 'Alice' }]
}

async function getList(page) {
  const list = await fetch(page)
  return list
}

(async () => {
  console.log(await getList(1))
})()
