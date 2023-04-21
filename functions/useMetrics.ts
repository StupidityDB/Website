// useMetrics.ts
import { useState, useEffect } from 'react'
import { RdbMetrics, MetricsObject } from '@global/functions/interface'

export function useMetrics(): RdbMetrics {
  const [rdbMetrics, setRdbMetrics] = useState<RdbMetrics>({
    currentReviewCount: 0,
    currentUsersCount: 0,
    currentRequestsCount: 0,
    targetReviewCount: 0,
    targetUsersCount: 0,
    targetRequestsCount: 0,
  })

  // Fetch the metrics from the API when the component mounts
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const res = await fetch('/api/metrics') as Response
      const data = await res.json() as MetricsObject
      // Set the target values to the fetched values
      setRdbMetrics((prevState: RdbMetrics) => ({
        ...prevState,
        targetReviewCount: parseInt(data.totalReviews, 10),
        targetUsersCount: parseInt(data.totalUsers, 10),
        targetRequestsCount: parseInt(data.totalRequests, 10),
      }))
    }

    fetchData()
  }, [])

  // Animate the metrics when they change
  useEffect(() => {
    function animate(): void {
      setRdbMetrics((prevState: RdbMetrics) => {
        let newReviewCount = prevState.currentReviewCount
        let newUsersCount = prevState.currentUsersCount
        let newRequestsCount = prevState.currentRequestsCount

        // Increment the metrics by 2000% of the difference between the current and target values
        if (prevState.currentReviewCount < prevState.targetReviewCount) {
          newReviewCount += Math.ceil(
            (prevState.targetReviewCount - prevState.currentReviewCount) / 2000,
          )
        }

        if (prevState.currentUsersCount < prevState.targetUsersCount) {
          newUsersCount += Math.ceil(
            (prevState.targetUsersCount - prevState.currentUsersCount) / 2000,
          )
        }

        if (prevState.currentRequestsCount < prevState.targetRequestsCount) {
          newRequestsCount += Math.ceil(
            (prevState.targetRequestsCount - prevState.currentRequestsCount) / 2000,
          )
        }

        return {
          ...prevState,
          currentReviewCount: newReviewCount,
          currentUsersCount: newUsersCount,
          currentRequestsCount: newRequestsCount,
        }
      })

      // Schedule the next frame if the animation is not finished
      if (
        rdbMetrics.currentReviewCount !== rdbMetrics.targetReviewCount ||
        rdbMetrics.currentUsersCount !== rdbMetrics.targetUsersCount ||
        rdbMetrics.currentRequestsCount !== rdbMetrics.targetRequestsCount
      ) {
        requestAnimationFrame(animate)
      }
    }

    // Start the animation
    requestAnimationFrame(animate)
  }, [rdbMetrics])

  return rdbMetrics
}
