import moment from "moment"
import "moment/locale/pt-br"
moment.locale("pt-br")

export const filterData = (data, filterSelected) => {
    let updatedData = []
    updatedData = data.filter((item) => {
        let result = null 
      
        for (const keyObj of Object.keys(item)) {

           for (const filter of filterSelected) {

              if (item[keyObj]  ===  null  && keyObj === filter.key) {
                result = false
                break
              }

                if (item[keyObj] !== null  && keyObj === filter.key) {
               
                    if (!filter.selectedDataInicial || !filter.selectedDataFinal) {
                        const dataCadastro =  moment(item.DataCadastro).utc().format("YYYY-MM-DD")
 
                        const periodDate = filter.selectedDataInicial ? filter.selectedDataInicial : filter.selectedDataFinal
                        
                        if (filter.selectedDataInicial) {
                            const isSame = moment(dataCadastro).isSame(periodDate)
                            if (isSame) {
                                result = true
                            } else {
                                result = false
                                break
                            }   
                        }
                    }
                    if (filter.selectedDataInicial && filter.selectedDataFinal) {
                        const dataCadastro =  moment(item.DataCadastro)
                        const isInitDateEqualEndDate = moment(filter.selectedDataInicial).isSame(filter.selectedDataFinal) 
        
                        if (isInitDateEqualEndDate) {
        
                            const isSameDate = moment(dataCadastro).isSame(filter.selectedDataInicial) 
        
                            if (isSameDate) {
                            result = true
                            } else {
                            result = false
                            break
                            }   
        
                        }
                
                        if (!isInitDateEqualEndDate) {
        
                            const isBetweenDate = moment(dataCadastro).isBetween(filter.selectedDataInicial, filter.selectedDataFinal)                            
        
                            const isSameOrAfterInit = moment(dataCadastro).isSameOrAfter(filter.selectedDataInicial) 
                            const isBeforeEnd = moment(dataCadastro).isBefore(filter.selectedDataFinal)
                            
                            const isSameOrBeforeEnd = moment(dataCadastro).isSameOrBefore(filter.selectedDataFinal) 
                            const isAfterInit = moment(dataCadastro).isAfter(filter.selectedDataInicial)   
        
                            if (isBetweenDate) {
                                result = true
                            } else if ( 
                                (isSameOrAfterInit && isBeforeEnd) 
                                || (isSameOrBeforeEnd && isAfterInit)
                            ) {
                                result = true
                            } else {
                                result = false
                                break
                            }                          
                        }
                    }  
                }
          }

          if (result  ===  false) {
            break
          }

        }

       return result
    })

    return updatedData
}

