/**
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

import { type Tokens } from '@/utils/uid'

/* Logic for filtering tasks. */

interface Node {
  node: {
    state: string
  }
  tokens: Tokens
}

/**
 * Return true if the node ID matches the given ID, or if no ID is given.
 */
export function matchID (node: Node, id?: string): boolean {
  return !id?.trim() || node.tokens.relativeID.includes(id)
}

/**
 * Return true if the given list of states includes the node state, or if
 * if the list is empty.
 */
export function matchState (node: Node, states?: string[]): boolean {
  return !states?.length || states.includes(node.node.state)
}

/**
 * Return true if a node matches the specified id/state filter.
 */
export function matchNode (node: Node, id?: string, states?: string[]): boolean {
  return matchID(node, id) && matchState(node, states)
}
