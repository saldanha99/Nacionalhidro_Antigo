import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import '@styles/base/pages/skeleton.scss'
export default function SkeletonDataTable(props) {

    const { configDataTableSkeleton } = props

    const makeMockListOnDataTable = () => {
        const list = []
        for (let index = 0; index < configDataTableSkeleton.quantityItensOnRow; index++) {
            list.push({name: `FAKE ${index}`})
        }

        return list
    }

    const tableSkeleton = () => {
        return  (
        <div className="mb-4">
                <SkeletonTheme
                    baseColor="#2f4b74"
                    highlightColor="#96c7ff"
                    borderRadius="0.5rem"
                    duration={4}
                >
                    <table className="table table-skeleton">
                        <thead>
                            <tr>
                                {
                                    configDataTableSkeleton.nameRows.map((item) => (
                                        <th>{item.name}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                        {
                            makeMockListOnDataTable().map(() => (
                                <tr>
                                    {
                                        configDataTableSkeleton.nameRows.map(() => (
                                            <td>{<Skeleton />}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </SkeletonTheme>
            </div>
        )
    }

    return (
       <>
         {tableSkeleton()}
       </>
    )
}
