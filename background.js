console.log('background started...')

// chrome.browserAction.onClicked.addListener(buttonClicked)

// function buttonClicked(tab) {
//   let msg = {
//     txt: 'hello'
//   }
//   console.log('console:', tab, msg)

//   // отправляем сообщение в content.js
//   chrome.tabs.sendMessage(tab.id, msg)
// }

function getСhatMessages(chatName) {
  chrome.runtime.sendMessage({
    action: "getСhatMessages",
    chatName: chatName
  })
}

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.type == "worktimer-notification")
//     chrome.notifications.create('worktimer-notification', request.options, function() { });

//   sendResponse()
// })


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('sender:', sender)

  if (request.action === "getPanelSideData") {
    console.log('panelSideData:', request)
    getСhatMessages(request.panelSideData[0].chatName)
    console.log('getСhatMessages go go', request.panelSideData[0].chatName)

    // sendResponse({
    //   action: "getСhatMessages",
    //   chatName: request.panelSideData[0].chatName
    // })
    // chrome.tabs.sendMessage({
    //   action: "getСhatMessages",
    //   chatName: request.panelSideData[0].chatName
    // })

      chrome.tabs.sendMessage(sender.tab.id, {
        action: "getСhatMessages",
        chatName: request.panelSideData[5].chatName
      })

  }



  // sendResponse();
})