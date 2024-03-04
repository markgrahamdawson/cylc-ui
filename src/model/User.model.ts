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

export default class User {
  constructor (
    /** The authenticated user (full info only available when authenticated
     * via the hub) */
    public username: string,
    /** User groups */
    public groups: string[],
    /** Date when the user was created */
    public created: string,
    /** Whether the user is an administrator or not */
    public admin: boolean,
    /** Server URL */
    public server: string,
    /** UIS owner (the user whose workflows we are looking at) (this might not
     * be the authenticated user for multi-user setups) */
    public owner: string,
    /** List of permissions */
    public permissions: string[],
    public mode: 'single user' | 'multi user',
    /** User initials */
    public initials: string
  ) {
    this.server ||= '?' // server can be unset
  }
}
