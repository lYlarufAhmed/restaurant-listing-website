import styled from 'styled-components'
import React, {useRef, useState} from "react";
import {FlexContainer} from "./StyledComponents";


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
export default function DataTable({data}) {
    let searchRef = useRef()
    const DATA = data.sort(((a, b) => ('' + a.name).localeCompare(b.name)))
    let genreChoices = []
    new Set(
        DATA.reduce((acc, row) => acc.concat(row.genre.split(',')), [])
            .sort((a, b) => ('' + a).localeCompare(('' + b)))
    ).forEach((elem) => genreChoices.push(elem))
    let [state, setState] = useState({
        start: 0,
        end: 10,
        currPage: 1,
        filter: 'All',
        feedback: '',
        query: '',
        totalPage: Math.ceil(DATA.length / 10)
    })
    let nextPage = () => {
        setState(prev => {
            let nextPage = prev.currPage < prev.totalPage ? prev.currPage + 1 : prev.currPage
            prev.currPage = nextPage
            let [start, end] = [(nextPage - 1) * 10, nextPage * 10]
            prev.start = start
            prev.end = end

            return JSON.parse(JSON.stringify(prev))
        })
    }
    let prevPage = () => {
        if (state.currPage > 1) {
            setState(prev => {
                prev.currPage--
                let [start, end] = [(prev.currPage - 1) * 10, prev.currPage * 10]
                return {...prev, start, end}
            })

        }
    }


    function applyFilter(e) {
        setState(prev => ({...prev, filter: e.target.value}))
    }

    function filterBySearch() {
        let query = searchRef.current.value
        if (query.length) {
            if (query.length > 3) {
                setState(prev => ({...prev, query, feedback: ''}))
            } else {
                setState(prev => ({...prev, feedback: 'Query should be at least 4 character long.'}))
            }
        } else
            setState(prev => ({...prev, query: '', feedback: ''}))

    }

    return (
        <Wrapper>
            <div className="search-control">
                <label htmlFor={'search'}>
                    <button onClick={(e) => filterBySearch()}>Search</button>
                </label>
                <input type={'text'} name={'search'} id={'search'} ref={searchRef}
                       onKeyPress={(e) => {
                           if (e.key === 'Enter') filterBySearch()
                       }}
                       onInput={e => {
                           if (!e.target.value.length) setState(prev => ({...prev, query: '', feedback: ''}))
                       }}
                />
            </div>
            {state.feedback && <div className="feedback">{state.feedback}</div>}

            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>name</th>
                    <th>city</th>
                    <th>state</th>
                    <th>phone number</th>
                    <th><span>
                        <label htmlFor={'genres'}>genres</label>
                        <select name={'genres'} id={'genres'} onInput={(e) => applyFilter(e)}>
                            {['All'].concat(genreChoices).map((g, index) => (
                                <option key={index} value={g}>{g}</option>
                            ))}
                        </select>
                    </span></th>
                </tr>
                </thead>
                <tbody>
                {DATA
                    .slice(state.start, state.end)
                    .filter((row) => state.query ? (
                        row.name.includes(state.query)
                        ||
                        row.city.includes(state.query)
                        ||
                        row.genre.includes(state.query)
                    ) : true)
                    .filter((row) => state.filter === 'All' ? true : row.genre.split(',').some((g) => g === state.filter))
                    .map((row, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
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