const puppeteer = require('puppeteer')
const fs = require('fs')

const scrapeCastles = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // page.on('console', consoleObj => console.log(consoleObj.text()))

  await page.exposeFunction('formatId', async string =>
    string
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-\s]/gi, '')
      .replace(/[\s]/gi, '-')
  )

  await page.exposeFunction('formatSentence', async string =>
    string
      .substr(0, string.indexOf('.') + 1)
      .replace(/\s\([^()]*\)/g, '')
      .replace(/\[[^\[\]]*\]/g, '')
  )

  await page.goto('https://en.wikipedia.org/wiki/List_of_castles_in_England', {
    waitUntil: 'networkidle0',
  })

  console.log('Waiting for data')

  // get initial list of castles
  let castles = await page.evaluate(async () => {
    const array = []
    // for each list of castles
    const tables = document.querySelectorAll('.wikitable')
    for (let table of tables) {
      // get the location from the nearest H2
      let heading = table.previousElementSibling
      while (heading !== null && heading.tagName !== 'H2') {
        heading = heading.previousElementSibling
      }
      const location = heading.firstChild.innerText

      // for each row
      const rows = table.querySelectorAll('tbody tr')
      for (let row of rows) {
        // skip if there’s nothing to follow
        const link = row.querySelector('td:nth-child(1) a')
        if (!link.innerText || !link.href) continue

        // gather props
        const name = link.innerText
        const href = link.href
        const id = await formatId(`${link.innerText}-${location}`)
        const type = row.querySelector('td:nth-child(2)').innerText
        const date = row.querySelector('td:nth-child(3)').innerText
        const condition = row.querySelector('td:nth-child(4)').innerText

        // sanitise ownership
        let ownership = ''
        const ownershipCell = row.querySelector('td:nth-child(6)')
        let ownershipText = ownershipCell.innerText
        let ownershipSpan = ownershipCell
          .querySelector('span[data-sort-value]')
          ?.getAttribute('data-sort-value')
          .replace('!', '')
          .trim()

        switch (ownershipSpan) {
          case 'EH':
            ownership = 'English Heritage'
            break
          case 'ENT':
            ownership = 'National Trust'
            break
          case 'HC':
            ownership = 'Public'
            break
          case 'HH':
            ownership = 'Historic House'
            break
          case 'HAL':
            ownership = 'Public'
            break
          case 'HM':
            ownership = 'Museum'
            break
        }

        if (!ownership) {
          switch (true) {
            case ownershipText.includes('University'):
              ownership = 'University'
              break
            case ownershipText.includes('School'):
              ownership = 'School'
              break
            case ownershipText === 'Public access':
              ownership = 'Public'
              break
            case ownershipText.includes('Golf'):
              ownership = 'Clubhouse'
              break
            case ownershipText.includes('conference'):
              ownership = 'Conference centre'
              break
            case ownershipText === 'Company HQ':
            case ownershipText === 'Local authority':
            case ownershipText === 'Private apartments':
            case ownershipText.includes('Council'):
              ownership = 'Private'
              break
            case ownershipText.includes(', '):
              ownershipText = ownershipText.split(', ')[0]
            case ownershipText.includes('/'):
              ownershipText = ownershipText.split(' / ')[0]
            default:
              ownership = ownershipText
              break
          }
        }

        // push castle
        array.push({
          id,
          name,
          condition,
          date,
          description: '',
          href,
          location,
          ownership,
          type,
          coords: null,
        })
      }
    }

    return array
  })

  console.log(`${castles.length} castles found`)

  // get more detail for each castle
  for (let castle of castles) {
    console.log(`Looking up ${castle.id}`)
    await page.goto(castle.href)
    detail = await page.evaluate(async () => {
      // get coordinates or die
      const geo = document.querySelector('.geo')?.innerText
      if (!geo) return
      const [lat, lng] = geo.split('; ')

      // get the first sentence
      const firstParagraph = document.querySelector(
        `#mw-content-text .mw-parser-output p:not(.mw-empty-elt)`
      )?.innerText
      const firstSentence = await formatSentence(firstParagraph)

      return {
        coords: { lat: +lat, lng: +lng },
        description: firstSentence,
      }
    })

    Object.assign(castle, detail)
  }

  castles = castles.filter(c => !!c.coords)

  browser.close()
  return castles
}

scrapeCastles().then(castles => {

  // write data file
  fs.writeFile(
    `./public/castles-data-${+new Date()}.json`
    JSON.stringify(castles, null, 2),
    err => {
      if (err) {
        console.log('Couldn’t write JSON')
      } else {
        console.log('Data file written')
      }
    }
  )

  // write index file
  const castlesIndex = castles.map(c => {
    return {
      id: c.id,
      name: c.name,
      coords: c.coords,
    }
  })
  fs.writeFile(
    `./public/castles-index-${+new Date()}.json`,
    JSON.stringify(castlesIndex, null, 2),
    err => {
      if (err) {
        console.log('Couldn’t write JSON')
      } else {
        console.log('Index file written')
      }
    }
  )
})

const reindexCastles = async () => {
  fs.readFile('./public/castles-data.json', 'utf8', (err, data) => {
    if (err) throw err
    const castles = JSON.parse(data)
    const castlesIndex = castles.map(c => {
      return {
        id: c.id,
        name: c.name,
        coords: c.coords,
      }
    })
    console.log(castlesIndex)
    fs.writeFile(
      `./public/castles-index-${+new Date()}.json`,
      JSON.stringify(castlesIndex, null, 2),
      err => {
        if (err) {
          console.log('Couldn’t write JSON')
        } else {
          console.log('Index file written')
        }
      }
    )
  })
}
