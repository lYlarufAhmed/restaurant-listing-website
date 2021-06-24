import styled from 'styled-components'
import React, {useEffect, useRef, useState} from "react";
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

function getFilters(data) {
    let filters = []
    new Set(data.reduce((acc, row) => acc.concat(row.genre.split(',')), [])
        .sort((a, b) => ('' + a).localeCompare(('' + b)))
    ).forEach((elem) => filters.push(elem))
    return filters
}

export default function DataTable({data}) {
    let searchRef = useRef()
    // const DATA = data.sort(((a, b) => ('' + a.name).localeCompare(b.name)))

    let [state, setState] = useState({
        start: 0,
        end: 10,
        currPage: 1,
        filter: 'All',
        feedback: '',
        query: '',
        totalPage: 1,
        dataRows: data.sort(((a, b) => ('' + a.name).localeCompare(b.name))),
        genreChoices: getFilters(data),
        filteredData: []
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
                // return {...prev, start, end}
                prev.start = start
                prev.end = end
                return JSON.parse(JSON.stringify(prev))
            })

        }
    }

    useEffect(() => {

        // setState(prev => {
        //     prev.totalPage = Math.ceil(prev.dataRows.length / 10)
        //     prev.genreChoices = getFilters(prev.dataRows)
        //     prev.start = 0
        //     prev.end = 10
        //     return JSON.parse(JSON.stringify(prev))
        // })
    }, [])


    function applyFilter(e) {
        console.log('use effect called')
        setState(prev => {
            let val = e.target.value
            prev.filter = val
            prev.start = 0
            prev.end = 10
            prev.filteredData = prev.dataRows.filter((row) => row.genre.includes(val))
            prev.totalPage = Math.ceil(prev.filteredData.length / 10)
            return JSON.parse(JSON.stringify(prev))
        })
    }

    function filterBySearch() {
        let query = searchRef.current.value
        if (query.length) {
            if (query.length > 3) {
                setState(prev => {
                    prev.query = query
                    let searchResult = data.filter(row => row.name.includes(query) || row.city.includes(query))
                    prev.dataRows = searchResult
                    prev.feedback = searchResult.length ? `${searchResult.length} matches found` : 'No matches found'
                    prev.currPage = 1
                    prev.totalPage = Math.ceil(searchResult.length / 10)
                    prev.start = 0
                    prev.end = 10
                    prev.filteredData = prev.filter !== 'All' ? searchResult.filter(row => row.genre.includes(prev.filter)) : []
                    prev.genreChoices = getFilters(prev.dataRows)
                    return JSON.parse(JSON.stringify(prev))
                })
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
                           if (!e.target.value.length) setState(prev => {
                               prev.dataRows = data
                               prev.query = ''
                               prev.feedback = ''
                               // prev.filter = 'All'
                               prev.filteredData = prev.filter === 'All' ? [] : data.filter(row => row.genre.includes(prev.filter))
                               prev.totalPage = Math.ceil((prev.filteredData.length ? prev.filteredData.length : prev.dataRows.length) / 10)
                               prev.genreChoices = getFilters(data)
                               return JSON.parse(JSON.stringify(prev))
                           })
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
                        <select name={'genres'} value={state.filter} id={'genres'} onInput={(e) => applyFilter(e)}>
                            {['All'].concat(state.genreChoices).map((g, index) => (
                                <option key={index} value={g}>{g}</option>
                            ))}
                        </select>
                    </span></th>
                </tr>
                </thead>
                <tbody>
                {state.filteredData.length ? state.filteredData
                    .slice(state.start, state.end)
                    .map((row, index) => <TableRow key={index} row={row} index={index}/>) : state.dataRows
                    .slice(state.start, state.end)
                    .map((row, index) => <TableRow key={index} row={row} index={index}/>)}
                </tbody>

            </table>
            <Pagination>
                <p>Total pages: {state.totalPage}</p>
                <PaginationControl onClick={() => prevPage()}>prev</PaginationControl>
                {state.currPage}
                <PaginationControl onClick={() => nextPage()}>next</PaginationControl>
            </Pagination>
        </Wrapper>
    )
}


function TableRow({row, index}) {
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
}