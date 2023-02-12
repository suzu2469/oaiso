import axios from 'axios'

export const discordClient = axios.create({
    baseURL: 'https://discord.com/api/v10',
})
