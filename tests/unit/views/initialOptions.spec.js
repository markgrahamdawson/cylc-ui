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

import { nextTick } from 'vue'
import { vi } from 'vitest'
import {
  updateInitialOptionsEvent,
  useInitialOptions
} from '@/views/initialOptions'

describe('useInitialOptions', () => {
  it('updates the initialOptions prop when the ref changes', async () => {
    const emit = vi.fn()
    const initialOptions = {
      name: 'Isaac Clarke',
      ship: 'USG Ishimura',
    }
    const props = { initialOptions }
    const name = useInitialOptions('name', { props, emit })
    // Should be called immediately
    expect(emit).toHaveBeenCalledWith(
      updateInitialOptionsEvent,
      initialOptions
    )
    emit.mockClear()
    // Change the value of the ref
    name.value = 'Nicole Brennan'
    await nextTick()
    expect(emit).toHaveBeenCalledWith(
      updateInitialOptionsEvent,
      {
        name: 'Nicole Brennan',
        ship: 'USG Ishimura',
      }
    )
  })
})
