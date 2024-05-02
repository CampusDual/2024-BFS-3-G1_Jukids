import { Component } from '@angular/core';
import { Expression, FilterExpressionUtils } from 'ontimize-web-ngx';

@Component({
  selector: 'app-toys-home',
  templateUrl: './toys-home.component.html',
  styleUrls: ['./toys-home.component.scss']
})
export class ToysHomeComponent {

  createFilter(values: Array<{ attr, value }>): Expression {

    //Valores de ingreso.
    console.log("values", values);
    //Array de expresiones para ejecutar
    let filters: Array<Expression> = [];
    //Generacion de expresion y guardado en array filters
    values.forEach(fil => {
      if (fil.value) {
        filters.push(FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value));
      }
    });

    //Ver la consulta generada, Key-Value (Columna-Valor)
    console.log("filters", filters);
    // Build complex expression

    if (filters.length > 0) {
      //Realiza la consulta concatenando los key-value (Columna-Valor) del array filters
      return filters.reduce((exp1, exp2) => FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR));
    } else {
      return null;
    }
  }


}
