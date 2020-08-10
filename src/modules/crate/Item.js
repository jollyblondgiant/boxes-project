// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

// UI Imports
import Card from '../../ui/card/Card'
import Button from '../../ui/button/Button'
import H4 from '../../ui/typography/H4'
import Icon from '../../ui/icon'
import { white, grey2, black } from '../../ui/common/colors'

// App Imports
import { APP_URL } from '../../setup/config/env'
import userRoutes from '../../setup/routes/user'
import { messageShow, messageHide } from '../common/api/actions'
import SubscriptionItem from '../subscription/Item'
import { create, getListByUser, getListByCrate } from '../subscription/api/actions'



// Component
class Item extends PureComponent {

    

    
    state = {
        crateId: this.props.crate.id
    }
   
    componentDidMount() {
        
        this.props.getListByUser()

    }

    
    constructor(props) {
        super(props)
        let crateId = props.crate.id        
        let subbed = props.userSubs.list
            .filter(sub=> sub.crate.id == crateId)
        
        this.state = {
            isSubbed: subbed.length == 1,
            isLoading: false,
            crateId: crateId,
        }
    }

      
    
    onClickSubscribe = (crateId) => {
        console.log(this.state)
      // this.setState({
      //   isLoading: true
      // })

      // this.props.messageShow('Subscribing, please wait...')

      // this.props.create({ crateId })
      //   .then(response => {
      //     if (response.data.errors && response.data.errors.length > 0) {
      //       this.props.messageShow(response.data.errors[0].message)
      //     } else {
      //       this.props.messageShow('Subscribed successfully.')

      //       this.props.history.push(userRoutes.subscriptions.path)
      //     }
      //   })
      //   .catch(error => {
      //     this.props.messageShow('There was some error subscribing to this crate. Please try again.')
      //   })
      //   .then(() => {
      //     this.setState({
      //       isLoading: false
      //     })

      //     window.setTimeout(() => {
      //       this.props.messageHide()
      //     }, 5000)
      //   })
    }

    render() {
        //const avgRate = this.props.crateSubs.average;
        let //rateList = this.props.crateSubs.list,        
            { id, name, description } = this.props.crate,
        { isLoading, isSubbed, crateId} = this.state,
        //{id, name, description} = crate,
        btnText = isSubbed ? "Subscribed" : "Subscribe"
        if (id == 1) {
            return (                
                <Card style={{ width: '18em', backgroundColor: white }}>
                <p style={{ padding: '2em 3em 0 3em' }}>
                <img src={`${ APP_URL }/images/crate.png`} alt={name} style={{ width: '100%' }}/>
                </p>                
                <div style={{ padding: '1em 1.2em' }}>
                <H4 font="secondary" style={{ color: black }}>{name}</H4>
              
                <p style={{ color: grey2, marginTop: '1em' }}>{description}</p>

                <p style={{ textAlign: 'center', marginTop: '1.5em', marginBottom: '1em' }}>
                <Button
            theme="primary"
            onClick={this.onClickSubscribe.bind(this, id)}
            type="button"
            disabled={ isLoading
                      //|| isSubbed
                     }
                >
                <Icon size={1.2} style={{ color: white }}>add</Icon> {btnText}
            </Button>
                </p>
                </div>
                </Card>
        )} else {return <Card></Card>}
    }
}

// Component Properties
Item.propTypes = {
    crate: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    messageShow: PropTypes.func.isRequired,
    messageHide: PropTypes.func.isRequired,
    getListByCrate: PropTypes.func.isRequired
}

// Component State


function itemState(state) {
    return {
        user: state.user,
        crateSubs: state.subscriptionsByCrate,       
        userSubs: state.subscriptionsByUser,
        
    }
}

export default connect(itemState, { getListByUser, getListByCrate, create, messageShow, messageHide })(withRouter(Item))
