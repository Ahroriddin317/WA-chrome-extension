// function setup() {
let userinput = document.getElementById('userinput')
// срабатывает всякий раз когда нажимается кнопка
if (userinput) {
  userinput.addEventListener('input', changeText)
}

function changeText(event) {
  let params = {
    active: true,
    currentWindow: true
  }
  chrome.tabs.query(params, gotTabs)
  function gotTabs(tabs) {
    let msg = {
      txt: userinput.value
    }
    console.log('msg:', msg)

    // отправляем сообщение в content.js
    chrome.tabs.sendMessage(tabs[0].id, msg)
  }
}


// }
// setup()



//   if (chatsList.length >= 0) {
//     for (let i = 0; i < chatsList.length; i += 1) {
//       const { chatName, img } = chatsList[i]
//       // await page.click(`[title="${chatName}"]`)
//       // await page.waitFor(1000)
//       await page.$$(`*[title="${chatName}"]`).then(it => it[0].click())
//       await page.$$(`*[title="${chatName}"]`).then(it => it[1].click())
//       await page.waitForSelector('div.Mr-fu')
//       await page.waitFor(1000)

//       const messages = await page.evaluate(() => {
//         attributeName = 'data-pre-plain-text'
//         return Array.from(document.querySelector('[aria-label="Список сообщений. Нажмите на стрелку вправо, чтобы открыть меню сообщения."]').children)
//           .reduce((acc, messageElement) => {
//             elementWithText = messageElement.querySelector(`div[${attributeName}]`)
//             if (elementWithText) {
//               const discription = elementWithText.getAttribute(attributeName).trim() // = '[07:46, 07.09.2020] Frenc: '
//               const time = discription.slice(1, 6)
//               const data = discription.slice(8, 18)
//               const from = discription.slice(20, -1)
//               const text = elementWithText.innerText
//               return [...acc, { time, data, from, text }]
//             }
//             return acc
//           }, [])
//       })

//       const telefon = await page.evaluate(() => {
//         return Array.from(document.querySelector('.Mr-fu').querySelectorAll('div'))
//           .filter(it => it.textContent === 'Сведения и номер телефона')[0]
//           .parentNode.children[2].textContent
//       })
//       console.log('messages:', telefon, messages)

//       data.push({ chatName, img, telefon, messages })
//     }
//     console.log('data:', data)

//   }



//   await page.screenshot({
//     path: screenshot,
//     fullPage: true
//   })
// }

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log('getСhatMessages go go', request, request.panelSideData[0].chatName)

  if (request.action === "getPanelSideData") {
    console.log('panelSideData:', request)
    // chrome.runtime.sendMessage({
    //   action: "getСhatMessages",
    //   chatName: request.panelSideData[0].chatName
    // })

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('tabs:', tabs)

      chrome.runtime.sendMessage(tabs[0].id, {
        action: "getСhatMessages",
        chatName: request.panelSideData[0].chatName
      })
    })
    console.log('getСhatMessages go go', request.panelSideData[0].chatName)
  }
})