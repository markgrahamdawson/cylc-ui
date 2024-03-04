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

interface WorkflowNode {
  node: {
    status: string
    stateTotals: Record<string, number>
  }
  tokens: Tokens
}

export function filterByName (workflow: WorkflowNode, name: string): boolean {
  return !name || workflow.tokens.workflow.toLowerCase().includes(name.toLowerCase())
}

/**
 * @private
 * @param stateTotals - object with the keys being states, and values the count
 */
function getWorkflowStates (stateTotals: Record<string, number>): string[] {
  return !stateTotals
    ? []
    : Object.keys(stateTotals).filter((state) => stateTotals[state] > 0)
}

export function filterByState (
  workflow: WorkflowNode,
  workflowStates: string[],
  taskStates: string[]
): boolean {
  // workflow states
  if (
    workflowStates.length && !workflowStates.includes(workflow.node.status)
  ) {
    return false
  }
  // task states
  if (taskStates.length) {
    return getWorkflowStates(workflow.node.stateTotals).some(
      (item) => taskStates.includes(item)
    )
  }
  return true
}
