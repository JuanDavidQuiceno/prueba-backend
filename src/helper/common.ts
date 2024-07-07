/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Op, WhereOptions } from 'sequelize';
import { randomUUID } from "crypto";
import chalk from 'chalk';
import { ParsedQs } from 'qs';

export class Common {
  /**
   * Muestra una traza en el log con tiempo
   */
  public showLogMessage(...[text, error, type]: ConfigLog) {

    // Si envian un error el determina el tipo
    type ??= error ? 'error' : 'log';

    // Si no hay error lo deja en null para que sea ignorado por el console
    error ??= '(Sin info)';

    // Si es error
    if (type == 'error') console.trace(`${chalk.green(moment(moment.now()).format('YYYY-MM-DD hh:mm:ss'))} :: ${chalk.red(text)}`, error);
    else console.log(chalk.green(moment(moment.now()).format('YYYY-MM-DD hh:mm:ss')) + ` :: ${chalk.blue(text)}`, error);
  }

  /**
   * Set value custom filter
   * @param query 
   * @param operation 
   */
  public setWhere<T>(query: ParsedQs, operation: 'or' | 'and' = 'or') {
    const filters: WhereOptions<T>[] = [];
    let where: WhereOptions<T> | undefined = undefined;

    for (const key in query) {
      if (key != 'page' && key != 'limit' && key != 'orderBy' && key != 'op') {
        filters.push({ [key]: { [Op.like]: `%${query[key]}%` } } as WhereOptions<T>)
      }
    }

    if (filters.length > 0) {
      if (filters.length > 1) {
        where = {
          [Op[operation]]: filters
        } as WhereOptions<T>
      }
      else where = filters[0];
    }

    return where;
  }


}

/** Logger of application */
export class Logger {

  public traceId: string;

  constructor(traceId?: string) {
    this.traceId = traceId ?? randomUUID();
  }

  /**
  * Show message into log
  * @param {string} text message to print
  * @param {any} args (optional) extra information
  */
  public log(text: string, ...args: any): void {
    const currentDate = moment(moment.now()).format('YYYY-MM-DD hh:mm:ss');
    const msg = `${currentDate} :: ${this.traceId} :: ${text}`;
    console.log(chalk.blue(msg), ...args);
  }

  /**
  * Show error message into log
  * @param {string} text message to print
  * @param {any} error (optional) extra information
  */
  public error(text: string, error: any): void {
    const currentDate = moment(moment.now()).format('YYYY-MM-DD hh:mm:ss');
    const msg = `${currentDate} :: ${this.traceId} :: ${text}`;
    console.trace(chalk.red(msg), error);
  }
}

/**
 * Configuración para la función de mensaje
 */
type ConfigLog =
  | [text: string, type?: 'error' | 'log']
  | [text: string, error: unknown, type?: 'error' | 'log']

