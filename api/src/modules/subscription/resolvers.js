// App Imports
import models from '../../setup/models'

// Get subscription by ID
export async function get(parentValue, { id }) {
  return await models.Subscription.findOne({
    where: { id },
    include: [
      { model: models.User, as: 'user' },
      { model: models.Crate, as: 'crate' },
    ]
  })
}

//Get subscriptions by crate
export async function getByCrate(parentValue, {crateId}, {auth}){
    return await models.Subscription.findAll({
        where: {
            crateId
        },
        include: [
            {model: models.Crate, as: 'crate'},
        ]
    })
    // if(auth.user && auth.user.id > 0) {
    //     return await models.Subscription.findAll({
    //         where: {
    //             CrateItem: crateId
    //         },
    //         include: [
    //             {model: models.Crate, as: 'crate'},
    //         ]
    //     })
    // } else {
    //     throw new Error('Please login to view your subscriptions.')
    // } 
}

// Get subscription by user
export async function getByUser(parentValue, {}, { auth }) {
  if(auth.user && auth.user.id > 0) {
    return await models.Subscription.findAll({
      where: {
        userId: auth.user.id
      },
      include: [
        {model: models.User, as: 'user'},
        {model: models.Crate, as: 'crate'},
      ]
    })
  } else {
    throw new Error('Please login to view your subscriptions.')
  }
}

// Get all subscriptions
export async function getAll() {
  return await models.Subscription.findAll({
    include: [
      { model: models.User, as: 'user' },
      { model: models.Crate, as: 'crate' },
    ]
  })
}

// Create subscription
export async function create(parentValue, { crateId }, { auth }) {
  if(auth.user && auth.user.id > 0) {
    return await models.Subscription.create({
      crateId,
      userId: auth.user.id
    })
  } else {
    throw new Error('Please login to subscribe to this crate.')
  }
}

// Delete subscription
export async function remove(parentValue, { id }, { auth }) {
    
  if(auth.user && auth.user.id > 0) {
    return await models.Subscription.destroy({where: {id, userId: auth.user.id}})
  } else {
    throw new Error('Access denied.')
  }
}

//Update Subscription
export async function update(parentValue, { id, rating }, { auth }) {
    console.log("reslovers", id, rating)
    if(auth.user && auth.user.id > 0) {
        return await models.Subscription.update(
            {
                rating
            },
            { where: { id } }
        )
    } else {
        throw new Error('Operation denied.')
    }
}
