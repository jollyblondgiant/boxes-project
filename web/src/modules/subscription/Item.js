// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// UI Imports
import Card from '../../ui/card/Card'
import Button from '../../ui/button/Button'
import H4 from '../../ui/typography/H4'
import Icon from '../../ui/icon'
import { white, grey2, black } from '../../ui/common/colors'
import StarRatingComponent from 'react-star-rating-component'

// App Imports
import { APP_URL } from '../../setup/config/env'
import { messageShow, messageHide } from '../common/api/actions'
import { remove, getListByUser, update } from './api/actions'

// Component
class Item extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            rating: this.props.subscription.rating
        }
    }
    rateViewToggle = () => {
        let {isLoading, rateView} = this.state
        this.setState({
            isLoading: isLoading,
            rateView: !rateView})
    }

    onStarClick(nextValue, prevValue, name) {
        let {isLoading, rateView} = this.state
        let { id } = this.props.subscription
        console.log(this.props.subscription)
        this.setState({
            isLoading: isLoading,
            rating: nextValue,
            rateView: rateView});
        this.props.update({id, nextValue})
            .then(response => {
                if (response.data.errors && response.data.errors.length > 0) {
                    this.props.messageShow(response.data.errors[0].message)
                } else {
                    console.log("rated")                    
                }
            })
    }

    onStarHover(nextValue, prevValue, name) {
        let {isLoading, rateView} = this.state
        this.setState({
            isLoading: isLoading,
            rating: nextValue,
            rateView: rateView})
        this.setState({rating: nextValue});
    }

    onClickUnsubscribe = (id) => {
        let check = confirm('Are you sure you want to unsubscribe to this crate?')

        if(check) {
            this.setState({
                isLoading: true,
                rateView: false
            })

            this.props.messageShow('Subscribing, please wait...')

            this.props.remove({id})
                .then(response => {
                    if (response.data.errors && response.data.errors.length > 0) {
                        this.props.messageShow(response.data.errors[0].message)
                    } else {
                        this.props.messageShow('Unsubscribed successfully.')

                        this.props.getListByUser()
                    }
                })
                .catch(error => {
                    this.props.messageShow('There was some error subscribing to this crate. Please try again.')
                })
                .then(() => {
                    this.setState({
                        isLoading: false
                    })

                    window.setTimeout(() => {
                        this.props.messageHide()
                    }, 5000)
                })
        }
    }

    render() {
        const { id, crate, createdAt } = this.props.subscription
        const { isLoading, rateView, rating } = this.state
        return (
            rateView
                ?
                <Card style={{ width: '18em', backgroundColor: white }}>
                <p style={{ padding: '2em 3em 0 3em' }}>
                <img src={`${ APP_URL }/images/crate.png`} alt={ crate.name } style={{ width: '100%' }}/>
                </p>

                <div style={{ padding: '1em 1.2em' }}>
                <H4 font="secondary" style={{ color: black }}>{ crate.name }</H4>

                <p style={{ color: grey2, marginTop: '1em' }}>{ crate.description }</p>
                
                <p style={{ textAlign: 'center', marginTop: '1.5em', marginBottom: '1em' }}>
                
                <Button
            theme="primary"            
            type="button"
            disabled={ isLoading }
                >
                <StarRatingComponent
            name="subRate"
            starCount={5}
            value={rating}
            onStarClick={this.onStarClick.bind(this)}
            onStarHover={this.onStarHover.bind(this)}
                />
                </Button>
                
            
                <Button
            theme="secondary"
            onClick={this.rateViewToggle.bind(this)}
            type="button"
            disabled={ isLoading }
                >
                <Icon size={1.2} style={{ color: white }}>cancel</Icon> cancel
            </Button>
                </p>
                

                <p style={{ color: grey2, marginTop: '1em', fontSize: '0.8em', textAlign: 'center' }}>
                Subscribed on { new Date(parseInt(createdAt)).toDateString() }
            </p>
                </div>
                </Card>
                :
                <Card style={{ width: '18em', backgroundColor: white }}>
                <p style={{ padding: '2em 3em 0 3em' }}>
                <img src={`${ APP_URL }/images/crate.png`} alt={ crate.name } style={{ width: '100%' }}/>
                </p>

                <div style={{ padding: '1em 1.2em' }}>
                <H4 font="secondary" style={{ color: black }}>{ crate.name }</H4>

                <p style={{ color: grey2, marginTop: '1em' }}>{ crate.description }</p>
                
            
                <p style={{ textAlign: 'center', marginTop: '1.5em', marginBottom: '1em' }}>
                
                <Button
            theme="primary"
            onClick={this.rateViewToggle.bind(this)}
            type="button"
            disabled={ isLoading }
                >
                <Icon size={1.2} style={{ color: white }}>star_half</Icon> Rate Crate!
            </Button>
                <Button
            theme="secondary"
            onClick={this.onClickUnsubscribe.bind(this, id)}
            type="button"
            disabled={ isLoading }
                >
                <Icon size={1.2} style={{ color: white }}>remove_circle_outline</Icon> Unsubscribe
            </Button>
                </p>

                <p style={{ color: grey2, marginTop: '1em', fontSize: '0.8em', textAlign: 'center' }}>
                Subscribed on { new Date(parseInt(createdAt)).toDateString() }
            </p>
                </div>
                </Card>)
        
        
    }
}

// Component Properties
Item.propTypes = {
    subscription: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    getListByUser: PropTypes.func.isRequired,
    messageShow: PropTypes.func.isRequired,
    messageHide: PropTypes.func.isRequired,
    
}

// Component State
function itemState(state) {
    return {
        user: state.user,
        averageRate: state.average
    }
}

export default connect(itemState, { remove, update, getListByUser, messageShow, messageHide })(withRouter(Item))
