// Imports
import axios from 'axios'
import { query, mutation } from 'gql-query-builder'

// App Imports
import { routeApi } from '../../../setup/routes'

// Actions Types
export const SUBSCRIPTIONS_GET_LIST_REQUEST = 'SUBSCRIPTIONS/GET_LIST_REQUEST'
export const SUBSCRIPTIONS_GET_LIST_RESPONSE = 'SUBSCRIPTIONS/GET_LIST_RESPONSE'
export const SUBSCRIPTIONS_GET_LIST_FAILURE = 'SUBSCRIPTIONS/GET_LIST_FAILURE'
export const SUBSCRIPTIONS_GET_LIST_BY_USER_REQUEST = 'SUBSCRIPTIONS/GET_LIST_BY_USER_REQUEST'
export const SUBSCRIPTIONS_GET_LIST_BY_USER_RESPONSE = 'SUBSCRIPTIONS/GET_LIST_BY_USER_RESPONSE'
export const SUBSCRIPTIONS_GET_LIST_BY_USER_FAILURE = 'SUBSCRIPTIONS/GET_LIST_BY_USER_FAILURE'
export const SUBSCRIPTIONS_GET_LIST_BY_CRATE_REQUEST = 'SUBSCRIPTIONS/GET_LIST_BY_CRATE_REQUEST'
export const SUBSCRIPTIONS_GET_LIST_BY_CRATE_RESPONSE = 'SUBSCRIPTIONS/GET_LIST_BY_CRATE_RESPONSE'
export const SUBSCRIPTIONS_GET_LIST_BY_CRATE_FAILURE = 'SUBSCIRPTIONS/GET_LIST_BY_CRATE_FAILURE'
export const SUBSCRIPTIONS_GET_REQUEST = 'SUBSCRIPTIONS/GET_REQUEST'
export const SUBSCRIPTIONS_GET_RESPONSE = 'SUBSCRIPTIONS/GET_RESPONSE'
export const SUBSCRIPTIONS_GET_FAILURE = 'SUBSCRIPTIONS/GET_FAILURE'

// Actions

// Get list of subscriptions
export function getList(isLoading = true) {
  return dispatch => {
    dispatch({
      type: SUBSCRIPTIONS_GET_LIST_REQUEST,
      error: null,
      isLoading
    })

    return axios.post(routeApi, query({
      operation: 'subscriptions',
        fields: ['id', 'user { name, email }', 'crate { id, name, description }', 'createdAt', 'rating']
    }))
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: SUBSCRIPTIONS_GET_LIST_RESPONSE,
            error: null,
            isLoading: false,
            list: response.data.data.subscriptions
          })
        } else {
          console.error(response)
        }
      })
      .catch(error => {
        dispatch({
          type: SUBSCRIPTIONS_GET_LIST_FAILURE,
          error: 'Some error occurred. Please try again.',
          isLoading: false
        })
      })
  }
}



//Get list of subscriptions by crate
export function getListByCrate(crateId, isLoading = true) {
    let variables = {crateId}
    return dispatch => {
        dispatch({
            type: SUBSCRIPTIONS_GET_LIST_BY_CRATE_REQUEST,
            error: null,
            isLoading
        })
        return axios.post(routeApi, query({
            operation: 'subscriptionsByCrate',
            variables: {crateId},
            fields: ['id', 'user { name, email }', 'crate { id, name, description }', 'createdAt', 'rating']}))
            .then(response => {                
                if (response.status === 200) {
                    let ratings = response.data.data.subscriptionsByCrate,
                        sumRate = ratings.reduce((a, sub) => a + sub.rating, 0),
                        denom, average;
                        
                    if (ratings.length < 1){average = sumRate /  1} else
                    { average = sumRate / ratings.length};
                    
                    dispatch({                        
                        type: SUBSCRIPTIONS_GET_LIST_BY_CRATE_RESPONSE,
                        error:null,
                        isLoading:false,
                        list: ratings,
                        average})
                } else {
                    console.error(response)
                }})
            .catch(error => {
                dispatch({
                    type: SUBSCRIPTIONS_GET_LIST_BY_CRATE_FAILURE,
                    error: 'Some error occurred. Please try again.',
                    isLoading: false 
                })})
    }
}


// Get list of subscriptions by user
export function getListByUser(isLoading = true) {
  return dispatch => {
    dispatch({
      type: SUBSCRIPTIONS_GET_LIST_BY_USER_REQUEST,
      error: null,
      isLoading
    })

    return axios.post(routeApi, query({
      operation: 'subscriptionsByUser',
        fields: ['id', 'user { name, email }', 'crate { id, name, description }', 'createdAt', 'rating']
    }))
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: SUBSCRIPTIONS_GET_LIST_BY_USER_RESPONSE,
            error: null,
            isLoading: false,
            list: response.data.data.subscriptionsByUser
          })
        } else {
          console.error(response)
        }
      })
      .catch(error => {
        dispatch({
          type: SUBSCRIPTIONS_GET_LIST_BY_USER_FAILURE,
          error: 'Some error occurred. Please try again.',
          isLoading: false
        })
      })
  }
}

// Get single subscription
export function get(slug, isLoading = true) {
    
  return dispatch => {
    dispatch({
      type: SUBSCRIPTIONS_GET_REQUEST,
      isLoading
    })

    return axios.post(routeApi, query({
      operation: 'subscription',
      variables: { slug },
        fields: ['id', 'user { name, email }', 'crate { id, name, description }', 'createdAt', 'rating']
    }))
      .then(response => {
        dispatch({
          type: SUBSCRIPTIONS_GET_RESPONSE,
          error: null,
          isLoading: false,
          item: response.data.data.subscription
        })
      })
      .catch(error => {
        dispatch({
          type: SUBSCRIPTIONS_GET_FAILURE,
          error: 'Some error occurred. Please try again.',
          isLoading: false
        })
      })
  }
}

//Update subscription with new rating
export function update(variables) {
    variables.rating = variables.nextValue
    delete variables.nextValue
    return dispatch => {
        return axios.post(routeApi, mutation({
            operation: 'subscriptionUpdate',
            variables,
            fields: ['id', 'rating']}))}}

// Create subscription
export function create(variables) {    
  return dispatch => {
    return axios.post(routeApi, mutation({
      operation: 'subscriptionCreate',
      variables,
      fields: ['id']
    }))
  }
}

// Remove subscription
export function remove(variables) {
  return dispatch => {
    return axios.post(routeApi, mutation({
      operation: 'subscriptionRemove',
      variables,
      fields: ['id']
    }))
  }
}
