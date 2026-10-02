const posts = [
    {
        "_id": "6aa8a1f23b7c4e91d2e5f801",
        "title": "Why Your React Server Components Still Feel Slow",
        "topics": [
            "react",
            "rsc",
            "nextjs",
            "performance"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Streaming isn’t magic if the data is still sequential"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Everyone is shipping React Server Components and expecting free performance. The reality is that if your "
                        },
                        {
                            "type": "text",
                            "text": "await",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " chain is still linear, you’re just moving the waterfall from the browser to the server."
                        }
                    ]
                },
                {
                    "type": "image",
                    "attrs": {
                        "src": "https://placehold.co/900x400/1a1b1e/e8e5de?text=RSC+Waterfall+vs+Parallel",
                        "alt": "diagram showing sequential vs parallel data fetching in RSC",
                        "title": null
                    }
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "The biggest win comes from "
                        },
                        {
                            "type": "text",
                            "text": "Promise.all",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " (or better, "
                        },
                        {
                            "type": "text",
                            "text": "Promise.allSettled",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": ") at the top of your page component and then letting the individual Suspense boundaries stream independently."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "tsx"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "export default async function ProductPage({ params }) {\n  // parallel, not sequential\n  const [product, reviews, related] = await Promise.all([\n    getProduct(params.id),\n    getReviews(params.id),\n    getRelated(params.id),\n  ]);\n\n  return (\n    <>\n      <ProductHeader product={product} />\n      <Suspense fallback={<ReviewsSkeleton />}>\n        <Reviews data={reviews} />\n      </Suspense>\n      <Related products={related} />\n    </>\n  );\n}"
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Never await one data source before starting the next if they are independent"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Use Suspense boundaries aggressively so the static shell can stream first"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Cache tags + revalidateTag are your friends for partial updates"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-12T14:22:11.441Z",
        "updatedAt": "2026-09-12T14:22:11.441Z"
    },
    {
        "_id": "6aa8a2b45c8d5f02e3f6g912",
        "title": "PostgreSQL Partial Indexes: The Feature Nobody Uses Enough",
        "topics": [
            "postgres",
            "sql",
            "performance",
            "indexing"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Stop indexing the entire table when 90% of rows never match"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "If you have a status column and 95% of rows are "
                        },
                        {
                            "type": "text",
                            "text": "archived",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": ", a normal index on that column is mostly dead weight. Partial indexes exist exactly for this."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "sql"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "-- only index the rows that actually matter\nCREATE INDEX concurrently idx_orders_active\nON orders (created_at DESC)\nWHERE status = 'active';\n\n-- or even more specific\nCREATE INDEX idx_orders_pending_payment\nON orders (user_id, created_at)\nWHERE status = 'pending' AND payment_status IS NULL;"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "The planner will only use the partial index when your query’s "
                        },
                        {
                            "type": "text",
                            "text": "WHERE",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " clause implies the same condition. That means you get a much smaller, hotter index and faster writes on the archived rows."
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Great for soft-delete flags, status columns, and multi-tenant “is_deleted” patterns"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Combine with expression indexes for even more power"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Always create them CONCURRENTLY in production"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-11T09:15:33.882Z",
        "updatedAt": "2026-09-11T09:15:33.882Z"
    },
    {
        "_id": "6aa8a3c56d9e6g13f4h7i023",
        "title": "The Real Cost of “Just Use Tailwind” in a Design System",
        "topics": [
            "css",
            "tailwind",
            "design-systems",
            "frontend"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Utility classes scale until they don’t"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Tailwind is fantastic for rapid product UI. The moment you need a real design system with semantic tokens, consistent spacing scales, and themeable components, the pure-utility approach starts fighting you."
                        }
                    ]
                },
                {
                    "type": "image",
                    "attrs": {
                        "src": "https://placehold.co/900x400/1a1b1e/e8e5de?text=Utility+Hell+vs+Token+Layer",
                        "alt": "comparison of pure utility classes vs design token layer",
                        "title": null
                    }
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "The sustainable pattern is: "
                        },
                        {
                            "type": "text",
                            "text": "design tokens → CSS variables → Tailwind theme extension → components",
                            "marks": [
                                {
                                    "type": "italic"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": ". That way designers can change a single token and every button, card, and modal updates without hunting through class strings."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "css"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": ":root {\n  --color-primary-500: #3b82f6;\n  --space-4: 1rem;\n  --radius-md: 0.375rem;\n}\n\n/* Tailwind config then maps these */"
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Keep Tailwind for layout and one-off adjustments"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Put semantic meaning in CSS variables or a token package"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Never hard-code colors or spacing in component className props"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-10T16:47:02.119Z",
        "updatedAt": "2026-09-10T16:47:02.119Z"
    },
    {
        "_id": "6aa8a4d67e0f7h24g5i8j134",
        "title": "Go’s Context Package Is Not Optional",
        "topics": [
            "golang",
            "concurrency",
            "backend"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "If your function signature doesn’t take context.Context, you’re doing it wrong"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Every network call, database query, or long-running operation in a Go service should accept a "
                        },
                        {
                            "type": "text",
                            "text": "context.Context",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": ". Not because the linter said so, but because cancellation and deadlines are the only sane way to stop work when the client is already gone."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "go"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "func (s *OrderService) Create(ctx context.Context, req CreateOrderRequest) (*Order, error) {\n    ctx, cancel := context.WithTimeout(ctx, 3*time.Second)\n    defer cancel()\n\n    // any downstream call that respects ctx will abort early\n    return s.repo.Insert(ctx, req)\n}"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Passing "
                        },
                        {
                            "type": "text",
                            "text": "context.Background()",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " or "
                        },
                        {
                            "type": "text",
                            "text": "context.TODO()",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " at the top of a request handler is a smell. Derive everything from the request context that already carries the deadline and cancellation signal."
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Always put context as the first parameter"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Never store a context in a struct"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Use WithTimeout / WithCancel / WithValue carefully — prefer values for request-scoped data only"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-09T11:03:44.567Z",
        "updatedAt": "2026-09-09T11:03:44.567Z"
    },
    {
        "_id": "6aa8a5e78f1g8i35h6j9k245",
        "title": "TypeScript’s satisfies Operator Fixed My Config Hell",
        "topics": [
            "typescript",
            "types",
            "frontend"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "as const was never enough"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "You want both: a precise literal type "
                        },
                        {
                            "type": "text",
                            "text": "and",
                            "marks": [
                                {
                                    "type": "italic"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " to make sure the value actually matches a broader interface. "
                        },
                        {
                            "type": "text",
                            "text": "satisfies",
                            "marks": [
                                {
                                    "type": "code"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " gives you both without the widening that a type annotation forces."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "ts"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "const routes = {\n  home: \"/\",\n  users: \"/users\",\n  user: (id: string) => `/users/${id}`,\n} as const satisfies Record<string, string | ((...args: any[]) => string)>;\n\n// routes.user is still the exact function type, not string\n// and you get an error if you add a non-string value"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "This is especially powerful for config objects, route maps, and theme definitions where you want IntelliSense on the keys while still validating the shape."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-08T18:29:51.203Z",
        "updatedAt": "2026-09-08T18:29:51.203Z"
    },
    {
        "_id": "6aa8a6f89g2h9j46i7k0l356",
        "title": "Kubernetes liveness vs readiness: the difference that bites you at 3 AM",
        "topics": [
            "kubernetes",
            "devops",
            "sre"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "One restarts the pod, the other just stops sending it traffic"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "If your readiness probe fails, the pod is removed from the Service endpoints. If your liveness probe fails, kubelet "
                        },
                        {
                            "type": "text",
                            "text": "kills and restarts",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " the container. Mixing them up is how you create restart loops during deploys."
                        }
                    ]
                },
                {
                    "type": "image",
                    "attrs": {
                        "src": "https://placehold.co/900x400/1a1b1e/e8e5de?text=Liveness+vs+Readiness+Probe",
                        "alt": "diagram of kubelet probe behavior",
                        "title": null
                    }
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Readiness = “I can accept traffic right now”"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Liveness = “I am so broken that restarting me is the only option”"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Never put a slow dependency check in liveness — it will thrash the pod"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "A good pattern: liveness is a cheap “process is alive” endpoint, readiness checks database connectivity and any warm-up state."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-07T07:55:18.774Z",
        "updatedAt": "2026-09-07T07:55:18.774Z"
    },
    {
        "_id": "6aa8a7g90h3i0k57j8l1m467",
        "title": "Stop Using useEffect for Data Fetching in 2026",
        "topics": [
            "react",
            "hooks",
            "frontend",
            "data-fetching"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "The mental model was always wrong"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "useEffect + fetch + useState is still the most common pattern I see in code reviews. It works until you need caching, deduplication, retries, or SSR. Then you reinvent a half-broken version of React Query / SWR / TanStack Query."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "tsx"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "// the 2026 way\nconst { data, isLoading, error } = useQuery({\n  queryKey: [\"posts\", postId],\n  queryFn: () => fetchPost(postId),\n  staleTime: 60_000,\n});"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "You get automatic background revalidation, request deduplication across components, and a single source of truth for loading / error states. The only reason to still hand-roll it is if you’re building the library itself."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-06T13:41:09.332Z",
        "updatedAt": "2026-09-06T13:41:09.332Z"
    },
    {
        "_id": "6aa8a8h01i4j1l68k9m2n578",
        "title": "Rust’s Ownership Model in One Mental Picture",
        "topics": [
            "rust",
            "memory",
            "systems"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "There is only one owner. Everything else is borrowing."
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Most people fight the borrow checker because they still think in terms of “I have a pointer.” In Rust you either "
                        },
                        {
                            "type": "text",
                            "text": "own",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " the value or you "
                        },
                        {
                            "type": "text",
                            "text": "borrow",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "text": " it. References are just temporary permission slips."
                        }
                    ]
                },
                {
                    "type": "image",
                    "attrs": {
                        "src": "https://placehold.co/900x400/1a1b1e/e8e5de?text=Ownership+%26+Borrowing",
                        "alt": "simple ownership diagram",
                        "title": null
                    }
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Moving transfers ownership — the old name is invalid"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Immutable borrows (&T) can be many, but no mutable borrows at the same time"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Mutable borrow (&mut T) is exclusive"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Once that picture clicks, the compiler errors stop feeling arbitrary and start feeling like a very strict (but helpful) friend."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-05T20:12:37.901Z",
        "updatedAt": "2026-09-05T20:12:37.901Z"
    },
    {
        "_id": "6aa8a9i12j5k2m79l0n3o689",
        "title": "How We Cut Our AWS Bill 40% Without Touching Code",
        "topics": [
            "aws",
            "cost",
            "cloud",
            "finops"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Rightsizing and Savings Plans did more than any refactor"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "We spent three months optimising queries and caching layers. The single biggest saving came from looking at the Cost Explorer “Rightsizing recommendations” and actually acting on them."
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Move steady-state workloads to Compute Savings Plans (1-year, no upfront)"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Kill idle EBS volumes and unattached Elastic IPs — they are pure waste"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Switch non-critical RDS instances to gp3 and enable storage autoscaling"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Use Spot for CI runners and batch jobs — 70% cheaper and easy to make resilient"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Most teams leave 30-50% of their cloud spend on the table because nobody owns FinOps. Assign someone and give them a weekly 30-minute review slot."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-04T08:33:26.445Z",
        "updatedAt": "2026-09-04T08:33:26.445Z"
    },
    {
        "_id": "6aa8aaj23k6l3n80m1o4p790",
        "title": "Zod + tRPC: End-to-End Type Safety Without the Ceremony",
        "topics": [
            "typescript",
            "trpc",
            "zod",
            "fullstack"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "One schema, zero manual type duplication"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Define the input once with Zod. tRPC infers the client and server types automatically. No more “did I update the interface on both sides?” bugs."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "ts"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "const createPost = publicProcedure\n  .input(z.object({\n    title: z.string().min(3),\n    topics: z.array(z.string()).max(8),\n  }))\n  .mutation(async ({ input, ctx }) => {\n    return ctx.db.posts.create({ data: input });\n  });\n\n// on the client — fully typed\nconst mutation = trpc.createPost.useMutation();\nmutation.mutate({ title: \"...\", topics: [\"rust\"] });"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "The best part is that validation errors become typed as well, so your UI can show field-level messages without any extra mapping."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-03T15:18:55.678Z",
        "updatedAt": "2026-09-03T15:18:55.678Z"
    },
    {
        "_id": "6aa8abk34l7m4o91n2p5q801",
        "title": "Why We Switched from Redis to KeyDB for Caching",
        "topics": [
            "redis",
            "keydb",
            "caching",
            "performance"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Multithreading and active-active replication for free"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Redis is single-threaded by design. KeyDB is a drop-in fork that is multi-threaded and supports active-active replication without the complexity of Redis Cluster or Redis Enterprise."
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Same RESP protocol — zero code changes"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Better throughput on multi-core machines"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Active-active is simpler than managing Redis Sentinel + Cluster for most teams"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "We saw ~2.5× higher ops/sec on the same instance size and much cleaner failover behaviour. If you are still on classic Redis and hitting CPU limits, it is worth a weekend experiment."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-02T12:07:41.119Z",
        "updatedAt": "2026-09-02T12:07:41.119Z"
    },
    {
        "_id": "6aa8acl45m8n5p02o3q6r912",
        "title": "CSS Container Queries Finally Killed the Media-Query Gymnastics",
        "topics": [
            "css",
            "frontend",
            "responsive"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Components that respond to their parent, not the viewport"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "For years we wrote media queries based on the viewport and then prayed the component would never be placed in a sidebar or a modal. Container queries fix that permanently."
                        }
                    ]
                },
                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "css"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": ".card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: grid;\n    grid-template-columns: 120px 1fr;\n  }\n}"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Now the same card component can look completely different depending on whether it is in a narrow column or a full-width section — without any JavaScript or extra className props."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-09-01T19:44:13.556Z",
        "updatedAt": "2026-09-01T19:44:13.556Z"
    },
    {
        "_id": "6aa8adm56n9o6q13p4r7s023",
        "title": "Observability Without the Noise: Sampling Done Right",
        "topics": [
            "observability",
            "otel",
            "sre",
            "tracing"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "100% of traces is usually a mistake"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Head-based sampling at 1–5% for healthy traffic + tail-based sampling that always keeps errors and high-latency traces is the only approach that scales past a few thousand RPS without melting your collector or your wallet."
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Always sample errors and anything above your p99"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Use consistent hashing so a request that is sampled stays sampled across services"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "OpenTelemetry’s probability sampler + a custom tail sampler is the modern default"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "If you are still sending every span to your backend, you are either very small or very rich."
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-08-31T10:21:08.334Z",
        "updatedAt": "2026-08-31T10:21:08.334Z"
    },
    {
        "_id": "6aa8aen67o0p7r24q5s8t134",
        "title": "The Case for Keeping Your Monolith a Little Longer",
        "topics": [
            "architecture",
            "monolith",
            "microservices"
        ],
        "content": {
            "type": "doc",
            "content": [
                {
                    "type": "heading",
                    "attrs": {
                        "level": "2"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Microservices are a tax you pay for organisational scale, not a free performance upgrade"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "If your team is still under ~15 engineers and you don’t have clear domain boundaries that change at different rates, a well-modularised monolith will almost always ship features faster and have fewer production incidents."
                        }
                    ]
                },
                {
                    "type": "image",
                    "attrs": {
                        "src": "https://placehold.co/900x400/1a1b1e/e8e5de?text=Monolith+vs+Microservices+Tradeoffs",
                        "alt": "trade-off matrix",
                        "title": null
                    }
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract services only when you have a concrete reason: independent scaling, different release cadence, or a team that is blocked waiting on another team. Until then, invest in module boundaries, good tests, and a single deployable artifact."
                        }
                    ]
                },
                {
                    "type": "bulletList",
                    "content": [
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Start with a modular monolith"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Use clear package / folder ownership"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Extract only when the pain is real and measurable"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "createdAt": "2026-08-30T14:56:22.887Z",
        "updatedAt": "2026-08-30T14:56:22.887Z"
    }
]

const Post = require('./models/postModel');
try {
    Post.create(posts);
    console.log('posts added');
} catch(err) {
    console.log(err);
}