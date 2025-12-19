"use client"

import { Github, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

const REPO_URL = "https://github.com/isboyjc/cleanup"
const API_URL = "https://api.github.com/repos/isboyjc/cleanup"

export function GitHubStarButton() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {
        // 静默处理错误
      })
  }, [])

  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    }
    return count.toString()
  }

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex"
    >
      <Button
        variant="outline"
        size="icon-sm"
        className="brutal-border-2 brutal-shadow-sm brutal-hover gap-1 px-2 w-auto"
        asChild
      >
        <span className="flex items-center gap-1.5">
          <Github className="w-4 h-4" />
          {stars !== null && (
            <span className="flex items-center gap-0.5 text-xs font-semibold">
              <Star className="w-3 h-3 fill-current" />
              {formatStars(stars)}
            </span>
          )}
        </span>
      </Button>
    </a>
  )
}
