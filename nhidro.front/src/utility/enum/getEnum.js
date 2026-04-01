import api from "@src/services/api"

export default function getEnum(tabela, atributo, set, optionsTodos = false, sort_asc = true) {
    api.get(
        `api/enums/getEnum?tabela=${tabela}&atributo=${atributo}`,
        function (data) {
          if (data) {
            data = data.map(function (item) {
              return {
                label: item.replaceAll("_", " "),
                value: item
              }
            })
          
            if (optionsTodos) data.unshift({ label: "Todos", value: "" })
          
            sort_asc ? data.sort() : data.reverse()
          
            set(data)
          
          } else return false
        }
    )   
}