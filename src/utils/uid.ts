/*
 * Copyright (C) NIWA & British Crown (Met Office) & Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* Universal ID (UID)
 *
 * This is a cut down version of `cylc.flow.id` for UI use.
 *
 * The regexes come from cylc-flow, the script etc/uid.py updates them
 * in the event they are changed in cylc-flow.
 */

/* eslint-disable no-useless-escape */

const UNIVERSAL_ID = new RegExp(`
    (?=.)
        (?:
          (?:
            ~
            ([^\/:\n~]+)
            (\/|$)
          )
          |^
        )
        (?:
          (
            (?!//)
            [^:~\n\/]+
            (?:
              (?:
                \/
                [^:~\n\/]+
              )+
            )?

          )
          (?:
            :
            ([^\/:\n]+)
          )?
          (?:
            (?:
                //(?!/)
            )?
            (?:

    //
    ([^~\/:\n]+)
    (?:
      :
      ([^\/:\n]+)
    )?
    (?:
      /
      (?:
        ([^\/:\n]+)
        (?:
          :
          ([^\/:\n]+)
        )?
        (?:
          /
          (?:
            ([^\/:\n]+)
            (?:
              :
              ([^\/:\n]+)
            )?
          )?
        )?
      )?
    )?

            )?
          )?
        )?
        $
`.replace(/[\s\n\r]/g, ''))

const RELATIVE_ID = new RegExp(`
    ^
        //
        ([^~\/:\n]+)
        (?:
          :
          ([^\/:\n]+)
        )?
        (?:
          /
          (?:
            ([^\/:\n]+)
            (?:
              :
              ([^\/:\n]+)
            )?
            (?:
              /
              (?:
                ([^\/:\n]+)
                (?:
                  :
                  ([^\/:\n]+)
                )?
              )?
            )?
          )?
        )?
    $
`.replace(/[\s\n\r]/g, ''))

/* eslint-enable no-useless-escape */

interface TokenFields {
  user?: string
  workflow?: string
  cycle?: string
  task?: string
  job?: string
}

type TokenKey = keyof TokenFields

type TokenTree = [TokenKey | 'workflow-part', string, Tokens][]

function detokenise (
  tokens: Tokens, workflow: boolean = true, relative: boolean = true
): string {
  let parts: string[] = []
  let ret = ''

  if (workflow) {
    if (tokens.user) {
      parts.push(`~${tokens.user}`)
    }
    if (tokens.workflow) {
      parts.push(tokens.workflow)
    }
    if (parts) {
      ret = parts.join('/')
      parts = []
    }
  }

  if (relative) {
    if (tokens.cycle) {
      parts.push(tokens.cycle)
      if (tokens.task) {
        parts.push(tokens.task)
        if (tokens.job) {
          parts.push(tokens.job)
        }
      }
      if (ret) {
        ret += '//'
      }
      ret += parts.join('/')
    }
  }

  return ret
}

export class Tokens implements TokenFields {
  /* Represents a Cylc UID.
   *
   * Provides the interfaces for parsing to and from string IDs.
   *
   * Create with a string ID:
   *   new Tokens('workflow//cycle/task')
   *
   * Inspect the tokens:
   *   // primary components
   *   tokens.user
   *   tokens.workflow
   *   tokens.cycle
   *   tokens.task
   *   tokens.job
   *   // Non UID objects which exist only in the data store:
   *   tokens.namespace
   *   tokens.edge
   *
   * Obtain string ID from a tokens object
   *   tokens.id           // the full ID
   *   tokens.workflowID  // the workflow part of the ID (the bit before the //)
   *   tokens.relativeID  // the task part of the ID (the bit after the //)
   */

  static KEYS: readonly TokenKey[] = ['user', 'workflow', 'cycle', 'task', 'job']
  static KEYS_LO_TO_HI: readonly TokenKey[] = [...Tokens.KEYS].reverse()

  user?: string
  workflow?: string
  cycle?: string
  task?: string
  job?: string

  id!: string
  workflowID!: string
  relativeID!: string
  namespace?: string
  edge?: [Tokens, Tokens]

  constructor (id: string, relative: boolean = false) {
    if (id == null) {
      throw new Error(`Invalid ID ${id}`)
    }

    let match: RegExpMatchArray | null = null

    // try to match relative ID (the leading // is implicit)
    if (relative) {
      match = `//${id}`.match(RELATIVE_ID)
      if (match) {
        this.cycle = match[1]
        this.task = match[3]
        this.job = match[5]
      }
    }

    // try to match full id (or // prefixed relative id)
    if (!match) {
      match = id.match(UNIVERSAL_ID)
      if (match) {
        this.user = match[1]
        this.workflow = match[3]
        this.cycle = match[5]
        this.task = match[7]
        this.job = match[9]
      } else {
        throw new Error(`Invalid ID ${id}`)
      }
    }

    // set derived properties
    this.compute()
  }

  protected compute (): void {
    this.id = detokenise(this)

    if (this.cycle?.startsWith('$namespace|')) {
      // this is a namespace definition
      this.namespace = this.cycle.replace('$namespace|', '')
      this.cycle = undefined
      this.task = undefined
      this.job = undefined
    } else if (this.cycle?.startsWith('$edge|')) {
      // this is an edge definition
      const [left, right] = this.id.replace(/.*\$edge\|/, '').split('|')
      this.edge = [new Tokens(left, true), new Tokens(right, true)]
      this.cycle = undefined
      this.task = undefined
      this.job = undefined
    }

    this.workflowID = detokenise(this, true, false)
    this.relativeID = detokenise(this, false, true)
  }

  clone (fields?: TokenFields): Tokens {
    const ret = Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this)
    )
    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        if (Tokens.KEYS.indexOf(key as TokenKey) === -1) {
          throw new Error(`Invalid key: ${key}`)
        }
        if (typeof value !== 'string' && typeof value !== 'undefined') {
          throw new Error(`Invalid type for value: ${value}`)
        }
        ret[key] = value
      }
      ret.compute()
    }
    return ret
  }

  workflowHierarchy (): [string, Tokens][] {
    if (!this.workflow) {
      throw new Error('Cannot get workflow hierarchy for a relative ID')
    }
    const hier: string[] = []
    const tokensList: [string, Tokens][] = []
    for (const part of this.workflow.split('/')) {
      // for each level of the hierarchy
      hier.push(part)
      // copy these tokens
      const tokens = this.clone({
        // amending the workflow ID to match its level in the hierarchy
        workflow: hier.join('/'),
        // wipe the relative tokens in-case they were set
        cycle: undefined,
        task: undefined,
        job: undefined,
      })
      tokensList.push([part, tokens])
    }
    return tokensList
  }

  lowestToken (): TokenKey {
    return Tokens.KEYS_LO_TO_HI.find(key => this[key]) as TokenKey
  }

  tree (): TokenTree {
    const ret: TokenTree = []
    if (this.user) {
      let tokens = new Tokens(`~${this.user}`)
      ret.push(['user', this.user, tokens])
      if (this.workflow) {
        const parts = this.workflow.split('/')
        const last = parts.pop() as string
        for (const part of parts) {
          if (!tokens.workflow) {
            tokens = tokens.clone({ workflow: part })
          } else {
            tokens = tokens.clone({ workflow: `${tokens.workflow}/${part}` })
          }
          ret.push(['workflow-part', part, tokens])
        }
        if (tokens.workflow) {
          tokens = tokens.clone({ workflow: `${tokens.workflow}/${last}` })
        } else {
          tokens = tokens.clone({ workflow: last })
        }
        ret.push(['workflow', last, tokens])
        if (this.cycle && this.cycle[0] !== '$') {
          tokens = tokens.clone({ cycle: this.cycle })
          ret.push(['cycle', this.cycle, tokens])
          if (this.task) {
            tokens = tokens.clone({ task: this.task })
            ret.push(['task', this.task, tokens])
            if (this.job) {
              tokens = tokens.clone({ job: this.job })
              ret.push(['job', this.job, tokens])
            }
          }
        }
      }
    }
    return ret
  }
}
