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

/**
 * Cylc valid task states.
 */
export enum TaskState {
  SUBMIT_FAILED = 'submit-failed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  RUNNING = 'running',
  SUBMITTED = 'submitted',
  PREPARING = 'preparing',
  WAITING = 'waiting',
  SUCCEEDED = 'succeeded',
}

export const TaskStateNames: readonly TaskState[] = Object.values(TaskState)

/**
 * Task states ordered for display purposes.
 */
export const TaskStateUserOrder: readonly TaskState[] = [
  TaskState.WAITING,
  TaskState.PREPARING,
  TaskState.SUBMITTED,
  TaskState.RUNNING,
  TaskState.SUCCEEDED,
  TaskState.SUBMIT_FAILED,
  TaskState.FAILED,
  TaskState.EXPIRED
]
