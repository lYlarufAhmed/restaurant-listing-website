import React, {useEffect} from "react";
import DataTable from "./DataTable";
// import {styled, css} from 'styled-components'
import styled from 'styled-components'
import {FlexContainer} from "./StyledComponents";


const Wrapper = styled(FlexContainer)`
flex-direction: column;
align-content: center;
padding: 0 2rem;

`

export default function App() {
    useEffect(() => {
        async function getData() {
            let res = await fetch('http://128.199.195.196:3001/', {
                method: 'GET',
                headers: {
                    'Authentication': 'Bearer iqi509189dxznal;,ggi'
                }
            })
            let data = await res.json()
            console.log(data)
        }
        getData()
    }, [])
    return (
        <Wrapper>
            <h1>Restaurant data</h1>
            <DataTable/>
        </Wrapper>
    )
}