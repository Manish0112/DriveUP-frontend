import React, { Component } from 'react';

import moment from 'moment';
import { message } from "antd/lib/index";
import { RESTService } from '../Api/api.js'

import Plans from './Plans';
import InstructorSelection from './InstructorSelection';
import SummaryComponent from './Summery';
import { history } from '../../Helper/history';
import { Button } from 'react-bootstrap';

class EnrollmentComponent extends Component{

    state = {
        firstPage : true,
        secondPage : false,
        finalPage : false,
        tableData: [],
        plan : 0,
        selectedSchedules : [],
        planSummary : {}
    };

    getInstructors = async (data) => {
        let response= await RESTService.getInstructorsForDates(data);

        var status = response.statusText;

        if(status === 'Instructors are Available' && response.data.result.length >= data.planNo){
            message.success('Select the available Instructors!');
            this.setState({
                firstPage : false,
                secondPage : true,
                tableData: response.data.result
            })
        }
        else{
            message.error('No available Instructors for selected slot! Select different dates or time slots!');
            this.setState({
                firstPage : true,
                secondPage: false
            })
        }
    };

    callBackAfterSelection = (data) => {
        this.setState({selectedSchedules: data , secondPage: false, finalPage: true})
    };


    myCallback = (planSummary) => {

        if(planSummary.plan === 'c'){
            this.setState({plan: 10})
        }
        else if(planSummary.plan === 'b'){
            this.setState({plan: 6})
        }
        else if(planSummary.plan === 'a'){
            this.setState({plan: 4})
        }

        this.setState({planSummary: planSummary});

        var slot0810='N';
        var slot1012='N';
        var slot1214='N';
        var slot1416='N';
        var slot1618='N';
        var slot1820='N';
        var slot2022='N';

        if(planSummary.slots.includes('slot0810')){
            slot0810='Y';
        }
        if(planSummary.slots.includes('slot1012')){
            slot1012='Y';
        }
        if(planSummary.slots.includes('slot1214')){
            slot1214='Y';
        }
        if(planSummary.slots.includes('slot1416')){
            slot1416='Y';
        }
        if(planSummary.slots.includes('slot1618')){
            slot1618='Y';
        }
        if(planSummary.slots.includes('slot1820')){
            slot1820='Y';
        }
        if(planSummary.slots.includes('slot2022')){
            slot2022='Y';
        }

        let fromdate = moment(planSummary.availDates[0]).format("DD-MMM-YYYY");
        let todate = moment(planSummary.availDates[1]).format("DD-MMM-YYYY");
    
        let data = {};

        data.fromdate=fromdate;
        data.todate=todate;
        data.slots=planSummary.slots;
        data.slot0810=slot0810;
        data.slot1012=slot1012;
        data.slot1214=slot1214;
        data.slot1416=slot1416;
        data.slot1618=slot1618;
        data.slot1820=slot1820;
        data.slot2022=slot2022;

        if(planSummary.plan === 'a'){
            data.planNo = 4;
        }
        else if(planSummary.plan === 'b'){
            data.planNo = 6;
        }
        else if(planSummary.plan === 'c'){
            data.planNo = 10
        }
        
        this.getInstructors(data);  
        
    };

    confirmation = async () => {
        
        let data = {};
        
        data.selectedSchedules=this.state.selectedSchedules;
        data.planSummary=this.state.planSummary;
        data.tableData=this.state.tableData;

        await RESTService.saveSummary(data);
        message.success('Enrollment confirmed!');
        history.push('/home/success');

    };


    render(){
        return(
            <div>
                {this.state.firstPage && <Plans callbackFromParent={this.myCallback}/>}
                {this.state.secondPage && <InstructorSelection callbackToSelect={this.callBackAfterSelection} instructorListFromParent={this.state.tableData} plan={this.state.plan} planSummary={this.state.planSummary}/>}
                {this.state.finalPage && <SummaryComponent selectedSchedules={this.state.selectedSchedules} planSummary={this.state.planSummary}/>}
                <br/>
                {this.state.finalPage && <Button type="primary" icon="poweroff" onClick={this.confirmation}
                    style={{float: 'center'}}>
                        Proceed to Payment
                </Button>}
            </div>
        )
    }

}

export default EnrollmentComponent;