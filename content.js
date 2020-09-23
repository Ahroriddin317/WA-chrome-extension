console.log('Go go Go')

const idPanelSide = 'pane-side'
const attributeNameForMessage = 'data-pre-plain-text'
const timeDelay = 0
const timeDelayForLoadingMessage = 1000
const periodToClickOnChat = 100
let chatsListElements = []

const delay = (ms) => new Promise(res => setTimeout(res, ms))

// callback executed when canvas was found
function takeChatListInformation() {
  chatsListElements = Array.from(document.querySelector(`#${idPanelSide}`)
    .children[0].children[0].children[0].childNodes)

  const arrayChatPositionsIsPanelSide = chatsListElements.map(it => it.style.transform.match(/\d/g).join(''))

  const hightOneChatPositionIsPanelSide = Math.max(...arrayChatPositionsIsPanelSide) / (arrayChatPositionsIsPanelSide.length - 1)

  const chatListData = chatsListElements.map(it => {
    const chatName = it.querySelector('*[dir="auto"]').textContent
    // const chatName = it.querySelectorAll(`span[title]`)[0].textContent

    const img = Array.from(it.querySelectorAll(`img[src]`)).map(it => it.getAttribute('src')).find(it => it.includes('http'))

    const position = Math.round(it.style.transform.match(/\d/g).join('') / hightOneChatPositionIsPanelSide)

    const smiles = it.querySelectorAll(`span[title]`)[1].querySelectorAll(`img[src]`)
    const arraySmilesImgLastMessage = Array.from(smiles).map(it => it.getAttribute('src'))
    const textLastMessage = it.querySelector('*[dir="ltr"]') ? it.querySelector('*[dir="ltr"]').textContent : ''
    const mediaLastMessage = textLastMessage ? '' : it.querySelectorAll(`span[title]`)[1].textContent
    const isNewMessage = it.querySelectorAll(`span[aria-label]`)[0] ? true : false
    return { chatName, img, lastMessage: { textLastMessage, mediaLastMessage, arraySmilesImgLastMessage }, isNewMessage, position }
  })
  return chatListData
}

async function clickOnEveryChatToLoadLastMessages(panelSideData) {
  for (const chat of panelSideData) {
    const chatDomElement = document.querySelector(`*[title="${chat.chatName}"]`)
    eventFire(chatDomElement)
    await delay(periodToClickOnChat)
  }
  return
}

async function addTelefomAndLastMessagesInPanelSideData(panelSideData) {
  const data = []
  for (const chat of panelSideData) {
    const chatDomElement = document.querySelector(`*[title="${chat.chatName}"]`)
    eventFire(chatDomElement)
    await delay(periodToClickOnChat)
    const contactDataLinck = document.querySelectorAll(`*[title="${chat.chatName}"]`)[1]
    contactDataLinck.click()
    await delay(periodToClickOnChat)

    const messages = Array.from(document.querySelector('[aria-label="Список сообщений. Нажмите на стрелку вправо, чтобы открыть меню сообщения."]').children)
      .reduce((acc, messageElement) => {
        elementWithText = messageElement.querySelector(`div[${attributeNameForMessage}]`)
        if (elementWithText) {
          const discription = elementWithText.getAttribute(attributeNameForMessage).trim() // = '[07:46, 07.09.2020] Frenc: '
          const time = discription.slice(1, 6)
          const data = discription.slice(8, 18)
          const from = discription.slice(20, -1)
          const text = elementWithText.innerText
          return [...acc, { time, data, from, text }]
        }
        return acc
      }, [])

    const telefon = Array.from(document.querySelector('.Mr-fu').querySelectorAll('div'))
      .filter(it => it.textContent === 'Сведения и номер телефона')[0]
      .parentNode.children[2].textContent

    data.push({ ...chat, messages, telefon })
  }
  return data
}

// set up the mutation observer
const observer = new MutationObserver(async function (mutationsList, observer) {
  // `mutationsList` is an array of mutations that occurred
  // `observer` is the MutationObserver instance
  // for (let mutation of mutationsList) {
  //   console.log('mutation all:', mutation)
  //   if (mutation.type === 'childList') {
  //     console.log('A child node has been added or removed.');
  //     // console.log('mutation.addedNodes:', mutation.addedNodes)

  //   } else if (mutation.type === 'childList') {
  //     console.log('A child node has been added or removed.');

  //   } else if (mutation.type === 'attributes') {
  //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
  //   }
  // }


  const panelSide = document.getElementById(idPanelSide)
  if (panelSide) {
    await setTimeout(async () => {
      const panelSideData = takeChatListInformation()

      await clickOnEveryChatToLoadLastMessages(panelSideData)

      await delay(timeDelayForLoadingMessage)

      const data = await addTelefomAndLastMessagesInPanelSideData(panelSideData)

      console.log('data:', data)

      chrome.runtime.sendMessage({
        action: "getPanelSideData",
        panelSideData
      })
    }, timeDelay);
    observer.disconnect() // stop observing
    return
  }
})

// start observing
observer.observe(document, {
  characterData: true,
  childList: true,
  subtree: true
})


// получаем сообщение из background.js

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {

  if (request.txt === 'hello') {
    let paragraphs = document.getElementsByTagName('p')
    for (elt of paragraphs) {
      elt.style['background-color'] = '#FF00FF'
    }
  }

  if (request.action === "getСhatMessages") {
    console.log('getСhatMessages chatName:', request.chatName)
    // const xpath = `//span[text()='${request.chatName}']`
    // const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    const chatElement = document.querySelectorAll(`*[title="${request.chatName}"]`)[0]
    eventFire(chatElement)

    await setTimeout(() => {
      const contactDataLinck = document.querySelectorAll(`*[title="${request.chatName}"]`)[1]
      contactDataLinck.click()
    }, timeDelay)

    let chatData = {}
    await setTimeout(() => {
      const messages = Array.from(document.querySelector('[aria-label="Список сообщений. Нажмите на стрелку вправо, чтобы открыть меню сообщения."]').children)
        .reduce((acc, messageElement) => {
          elementWithText = messageElement.querySelector(`div[${attributeNameForMessage}]`)
          if (elementWithText) {
            const discription = elementWithText.getAttribute(attributeNameForMessage).trim() // = '[07:46, 07.09.2020] Frenc: '
            const time = discription.slice(1, 6)
            const data = discription.slice(8, 18)
            const from = discription.slice(20, -1)
            const text = elementWithText.innerText
            return [...acc, { time, data, from, text }]
          }
          return acc
        }, [])

      const telefon = Array.from(document.querySelector('.Mr-fu').querySelectorAll('div'))
        .filter(it => it.textContent === 'Сведения и номер телефона')[0]
        .parentNode.children[2].textContent

      chatData = { ...{}, messages, telefon }
      console.log('chatData:', chatData)

    }, timeDelayForLoadingMessage)


  }

})

function eventFire(el) {
  const etype = 'mousedown'
  const evt = document.createEvent("MouseEvents")
  evt.initMouseEvent(etype, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  el.dispatchEvent(evt)
}
