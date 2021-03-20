//Options
const id = 'd560d55a-7838-40fe-94bd-e74bcb2c32e7'
const firstUser = 'Jenell'
const secondUser = 'Horst'
const defaultWordsPerMinute = 238
const acceleratedWordsPerMinute = 238


//Code
const wordsPerMinute = Number(window.localStorage.getItem(id)) || defaultWordsPerMinute

const conversationsWrapper = document.getElementById('conversation')

const createMessage = (author, text, id = '') => {
    conversationsWrapper.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="message-wrapper">
        <div class="avatar"></div>
        <div class="message">
            ${author.length > 0 ?
            `
                <div class="author">
                    ${author}
                </div>
                `
            :
            ''
        }
            <span>
                ${text}
            </span>
        </div>
    </div>
    `)
}

const endMessage = () => {
    conversationsWrapper.insertAdjacentHTML('beforeend', `
    <div class="end-message-wrapper">
        <span class="end-message">
            Fin de la conversación
        </span>
    </div>
    `)
}

const completedOnce = () => {
    return window.localStorage.setItem(id, acceleratedWordsPerMinute)
}

const pendingMessage = () => {
    const temporal = document.getElementById('temporal')

    if (temporal) {
        temporal.remove()
        return
    }

    createMessage('', '...', 'temporal')
}

const fetchData = async () => {
    try {
        const response = await fetch('../assets/conversation.txt')
        const parsedResponse = await response.text()

        let temp = 0

        const data = parsedResponse.split(/\s\n\s\n/g).map((e, index) => {
            temp += 1000 * 60 * (e.split(' ').length / wordsPerMinute)

            return {
                readTime: temp,
                author: index % 2 ? secondUser : firstUser,
                content: e
            }
        })

        return data

    } catch (error) {
        console.log('Ocurrió un error al cargar los datos de la conversación.', error)
    }
}

const generateChat = async () => {
    const conversation = await fetchData()

    conversation.forEach((e, index) => {
        const info = `${e.author} ${index + 1} de ${conversation.length}`

        if (index === 0) {
            createMessage(info, e.content)
            pendingMessage()
            return
        }

        if (index >= conversation.length - 1) {
            setTimeout(() => {
                pendingMessage()
                createMessage(info, e.content)

                setTimeout(() => {
                    endMessage()
                    completedOnce()
                }, 2000);

            }, conversation[index - 1].readTime)
            return
        }

        setTimeout(() => {
            pendingMessage()
            createMessage(info, e.content)
            pendingMessage()
        }, conversation[index - 1].readTime);
        return
    })

}

generateChat()