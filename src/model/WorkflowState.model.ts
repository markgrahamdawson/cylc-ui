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

import {
  mdiPauseCircle,
  mdiPlayCircle,
  mdiSkipNextCircle,
  mdiStopCircle
} from '@mdi/js'

/**
 * Cylc valid workflow states.
 */
export enum WorkflowState {
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
}

export const WorkflowStateIcons: ReadonlyMap<WorkflowState, string> = new Map([
  [WorkflowState.RUNNING, mdiPlayCircle],
  [WorkflowState.PAUSED, mdiPauseCircle],
  [WorkflowState.STOPPING, mdiSkipNextCircle],
  [WorkflowState.STOPPED, mdiStopCircle]
])

/**
 * Workflow states ordered for display purposes.
 */
export function getWorkflowStateOrder (state: WorkflowState | undefined): number {
  switch (state) {
    case WorkflowState.RUNNING: return 1
    case WorkflowState.PAUSED: return 1
    case WorkflowState.STOPPING: return 1
    case WorkflowState.STOPPED: return 2
    default: return 9
  }
}
