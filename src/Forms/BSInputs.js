import React from 'react'
import { handleForm, validateAll } from '../Utils/utils'
import { connect } from 'react-redux'
import { CustomFormItemInput, CustomUpdateButton } from './FormHelper'
import { getAllData, getCalibration } from '../Actions/lambda'
import InputCalibrator, {switchComponent} from './InputCalibrator'
import {
    sigmaBounds,
    flexObj,
    gutter
} from './globalOptions'
import { Row, Col } from 'antd'
import {
    updateBS
} from '../Actions/parameters'
import ShowJson from './ShowJson'
import CommonInputs from './CommonInputs'

const Manual=({formValidation, bsParameters, updateBS, submitOptions, calibrateParameters})=>[
    <Col {...flexObj} key={0}>
        <CustomFormItemInput 
            objKey='sigma' 
            validationResults={formValidation}
            label="Volatility"
            parms={bsParameters}
            validator={sigmaBounds}
            toolTip="This is the volatility of the diffusion component of the (extended) CGMY process"
            onChange={updateBS}
        />
    </Col>,
    <Col {...flexObj} key={1}>
        <CustomUpdateButton
            disabled={validateAll(formValidation)}
            onClick={handleForm(submitOptions, {...bsParameters, ...calibrateParameters})}
        />  
    </Col>
]

const BSForm=({bsParameters, submitOptions, calibrateParameters, submitCalibration, updateBS, formValidation, type, bsNotify})=>[
    <Row gutter={gutter} key={0}>
        <CommonInputs parameters={bsParameters} validation={formValidation} update={updateBS} />
        {switchComponent(type==='manual', 
        <Manual 
            formValidation={formValidation} 
            bsParameters={bsParameters} 
            updateBS={updateBS} 
            submitOptions={submitOptions}
            calibrateParameters={calibrateParameters}
        />, 
        <InputCalibrator 
            parameters={bsParameters} 
            validation={formValidation}
            submitOptions={submitCalibration}
            isInProgress={bsNotify}
        />)}
    </Row>,
    <Row key={1}>
        <ShowJson parameters={bsParameters}/>
    </Row>
]
const mapStateToPropsBS=({bsParameters, bsValidation, bsNotify, calibrateParameters})=>({
    bsParameters, 
    formValidation:bsValidation,
    bsNotify, 
    calibrateParameters
})
const bsCalibration=getCalibration('bs')
const mapDispatchToPropsBS=dispatch=>({
    submitOptions:parameters=>{
        getAllData(parameters, dispatch)
    },
    submitCalibration:parameters=>{
        bsCalibration(parameters, dispatch)
    },
    updateBS:(key, value, validateStatus)=>{
        updateBS(key, value, validateStatus, dispatch)
    }
})
export default connect(
    mapStateToPropsBS,
    mapDispatchToPropsBS
)(BSForm)