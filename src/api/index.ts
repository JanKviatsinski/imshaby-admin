import { IMassCreate } from "./interfeces";

const BASE_URL = process.env.API_URL;

export const getParishById = async (token, id) => {
  return await request(BASE_URL + 'parish/' + id, token)
};

export const getWeekSchedule = async (token, id, date) => {
  return await request(BASE_URL + 'mass/week?' + `parishId=${id}&date=${date}`, token)
};

export const createMass = async (token, data: IMassCreate) => {
  return await requestPost(BASE_URL + 'mass', token,'POST', data)
};

export const deleteMass = async (token, id: string, period: {from: string, to: string}) => {
  const url = new URLSearchParams(period);
  return await request(BASE_URL + `mass/${id}/` + url, token,'DELETE')
};

export const approveSchedule = async (token, parishId: string) => {
  return await request(BASE_URL + `mass?parishId=${parishId}`, token,'PUT')
};

const request = (url, token, method?, data?) => {
  return fetch(url, {
    method: method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => handleError(res))
    .then(res => res.json())
    .catch(err => console.error(err))
};

const requestPost = (url, token, method?, data?) => {
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => handleError(res))
    .then(res => res.json())
    .catch(err => console.error(err))
};

const handleError = (res) => {
  if(!res.ok) throw new Error(res.statusText)
  return res
}
