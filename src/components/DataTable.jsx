import styled from 'styled-components'
import data from '../data'
import {useState} from "react";
import {FlexContainer} from "./StyledComponents";

const DATA = data.sort(((a, b) => ('' + a.name).localeCompare(b.name)))


const Wrapper = styled(FlexContainer)`
// justify-content: center;
align-content: center;
flex-direction: column;
width: 100%;
gap: 2rem;
`
const Pagination = styled(FlexContainer)`
gap: 1.3rem;
padding: .2rem .5rem;
justify-content: center;
width: 100%;
align-items: center;
`

const PaginationControl = styled.button`
height: 2rem;
`
export default function DataTable() {
    let [state, setState] = useState({
        data: DATA.slice(0, 10),
        currPage: 1,
        totalPage: Math.ceil(DATA.length / 10)
    })
    let nextPage = () => {
        setState(prev => {
            let nextPage = prev.currPage < prev.totalPage ? prev.currPage + 1 : prev.currPage
            prev.data = DATA.slice((nextPage - 1) * 10, nextPage * 10)
            prev.currPage = nextPage
            return JSON.parse(JSON.stringify(prev))
        })
    }
    let prevPage = () => {
        if (state.currPage > 1) {
            setState(prev => {
                prev.currPage--
                prev.data = DATA.slice((prev.currPage - 1) * 10, prev.currPage * 10)
                return JSON.parse(JSON.stringify(prev))
            })

        }
    }
    return (
        <Wrapper>
            <table>
                <thead>
                <tr>
                    <th>name</th>
                    <th>city</th>
                    <th>state</th>
                    <th>phone number</th>
                    <th>genres</th>
                </tr>
                </thead>
                <tbody>
                {state.data.map((row, index) => {
                    return (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.city}</td>
                            <td>{row.state}</td>
                            <td>{row.telephone}</td>
                            <td>{row.genre}</td>
                        </tr>
                    )
                })}
                </tbody>

            </table>
            <Pagination>
                <PaginationControl onClick={() => prevPage()}>prev</PaginationControl>
                {state.currPage}
                <PaginationControl onClick={() => nextPage()}>next</PaginationControl>
            </Pagination>
        </Wrapper>
    )
}