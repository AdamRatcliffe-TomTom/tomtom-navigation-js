const LocationMarkerIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iMTAyIiB2aWV3Qm94PSIwIDAgODEgMTAyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6bXVsdGlwbHkiIG9wYWNpdHk9IjAuMjk5MjQ3Ij4KPGVsbGlwc2UgY3g9IjQwLjUwMDEiIGN5PSI5NC4xNjY1IiByeD0iMTguMzMzMyIgcnk9IjcuNSIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzE3NjVfMTczMzUpIi8+CjwvZz4KPHJlY3QgeD0iODAuNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIHRyYW5zZm9ybT0icm90YXRlKDkwIDgwLjUgMCkiIGZpbGw9IiMxOTg4Q0YiLz4KPHJlY3QgeD0iNzkiIHk9IjEuNSIgd2lkdGg9Ijc3IiBoZWlnaHQ9Ijc3IiByeD0iMzguNSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNzkgMS41KSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxtYXNrIGlkPSJwYXRoLTQtaW5zaWRlLTFfMTc2NV8xNzMzNSIgZmlsbD0id2hpdGUiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTY4Ljc4NDMgMTEuNzE1N0M1My4xNjMzIC0zLjkwNTI0IDI3LjgzNjcgLTMuOTA1MjQgMTIuMjE1NyAxMS43MTU3Qy0zLjQwNTI0IDI3LjMzNjcgLTMuNDA1MjQgNTIuNjYzMyAxMi4yMTU3IDY4LjI4NDNDMTIuNjM3NCA2OC43MDU5IDEzLjA2NiA2OS4xMTYxIDEzLjUwMTQgNjkuNTE1QzIyLjI1NTMgNzcuNTM0NiAzMi44MzIgODQuMjE4NSAzOC43NjggOTQuNUMzOS41Mzc4IDk1LjgzMzMgNDEuNDYyMyA5NS44MzMzIDQyLjIzMjIgOTQuNUM0OC4xNjgyIDg0LjIxODUgNTguNzQ0OSA3Ny41MzQ1IDY3LjQ5ODggNjkuNTE0OEM2Ny45MzQxIDY5LjExNiA2OC4zNjI3IDY4LjcwNTggNjguNzg0MyA2OC4yODQzQzg0LjQwNTIgNTIuNjYzMyA4NC40MDUyIDI3LjMzNjcgNjguNzg0MyAxMS43MTU3WiIvPgo8L21hc2s+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNjguNzg0MyAxMS43MTU3QzUzLjE2MzMgLTMuOTA1MjQgMjcuODM2NyAtMy45MDUyNCAxMi4yMTU3IDExLjcxNTdDLTMuNDA1MjQgMjcuMzM2NyAtMy40MDUyNCA1Mi42NjMzIDEyLjIxNTcgNjguMjg0M0MxMi42Mzc0IDY4LjcwNTkgMTMuMDY2IDY5LjExNjEgMTMuNTAxNCA2OS41MTVDMjIuMjU1MyA3Ny41MzQ2IDMyLjgzMiA4NC4yMTg1IDM4Ljc2OCA5NC41QzM5LjUzNzggOTUuODMzMyA0MS40NjIzIDk1LjgzMzMgNDIuMjMyMiA5NC41QzQ4LjE2ODIgODQuMjE4NSA1OC43NDQ5IDc3LjUzNDUgNjcuNDk4OCA2OS41MTQ4QzY3LjkzNDEgNjkuMTE2IDY4LjM2MjcgNjguNzA1OCA2OC43ODQzIDY4LjI4NDNDODQuNDA1MiA1Mi42NjMzIDg0LjQwNTIgMjcuMzM2NyA2OC43ODQzIDExLjcxNTdaIiBmaWxsPSIjMTk4OENGIi8+CjxwYXRoIGQ9Ik0xMi4yMTU3IDExLjcxNTdMMTUuMDQ0MiAxNC41NDQyTDEyLjIxNTcgMTEuNzE1N1pNNjguNzg0MyAxMS43MTU3TDY1Ljk1NTggMTQuNTQ0MlYxNC41NDQyTDY4Ljc4NDMgMTEuNzE1N1pNMTIuMjE1NyA2OC4yODQzTDkuMzg3MyA3MS4xMTI3SDkuMzg3M0wxMi4yMTU3IDY4LjI4NDNaTTM4Ljc2OCA5NC41TDM1LjMwMzkgOTYuNUwzNS4zMDQgOTYuNUwzOC43NjggOTQuNVpNMTUuMDQ0MiAxNC41NDQyQzI5LjEwMyAwLjQ4NTI4MSA1MS44OTcgMC40ODUyODIgNjUuOTU1OCAxNC41NDQyTDcxLjYxMjcgOC44ODczQzU0LjQyOTYgLTguMjk1NzcgMjYuNTcwNCAtOC4yOTU3NyA5LjM4NzMgOC44ODczTDE1LjA0NDIgMTQuNTQ0MlpNMTUuMDQ0MiA2NS40NTU4QzAuOTg1MjgyIDUxLjM5NyAwLjk4NTI4MiAyOC42MDMgMTUuMDQ0MiAxNC41NDQyTDkuMzg3MyA4Ljg4NzNDLTcuNzk1NzcgMjYuMDcwNCAtNy43OTU3NyA1My45Mjk2IDkuMzg3MyA3MS4xMTI3TDE1LjA0NDIgNjUuNDU1OFpNMTYuMjAzNSA2Ni41NjU2QzE1LjgxMTEgNjYuMjA2MSAxNS40MjQ1IDY1LjgzNjIgMTUuMDQ0MiA2NS40NTU4TDkuMzg3MyA3MS4xMTI3QzkuODUwMTkgNzEuNTc1NiAxMC4zMjEgNzIuMDI2MiAxMC43OTk0IDcyLjQ2NDRMMTYuMjAzNSA2Ni41NjU2Wk0zNS4zMDQgOTYuNUMzNy42MTMzIDEwMC41IDQzLjM4NjggMTAwLjUgNDUuNjk2MyA5Ni41TDM4Ljc2OCA5Mi41QzM5LjUzNzkgOTEuMTY2NiA0MS40NjI0IDkxLjE2NjcgNDIuMjMyMSA5Mi41TDM1LjMwNCA5Ni41Wk02NS45NTU4IDY1LjQ1NThDNjUuNTc1NSA2NS44MzYxIDY1LjE4OTEgNjYuMjA2IDY0Ljc5NjggNjYuNTY1NEw3MC4yMDA5IDcyLjQ2NDJDNzAuNjc5MSA3Mi4wMjYgNzEuMTQ5OSA3MS41NzU1IDcxLjYxMjcgNzEuMTEyN0w2NS45NTU4IDY1LjQ1NThaTTY1Ljk1NTggMTQuNTQ0MkM4MC4wMTQ3IDI4LjYwMyA4MC4wMTQ3IDUxLjM5NyA2NS45NTU4IDY1LjQ1NThMNzEuNjEyNyA3MS4xMTI3Qzg4Ljc5NTggNTMuOTI5NiA4OC43OTU4IDI2LjA3MDQgNzEuNjEyNyA4Ljg4NzNMNjUuOTU1OCAxNC41NDQyWk00NS42OTYzIDk2LjVDNDguMzQ1OSA5MS45MTA3IDUyLjEwMDMgODguMDA2NCA1Ni40NTczIDg0LjE1NjhDNTguNjM2NiA4Mi4yMzEyIDYwLjkwMzkgODAuMzcyNCA2My4yNDIgNzguNDM4NUM2NS41NTY5IDc2LjUyMzggNjcuOTI5OCA3NC41NDQ4IDcwLjIwMDkgNzIuNDY0Mkw2NC43OTY4IDY2LjU2NTRDNjIuNjkwOSA2OC40OTQ2IDYwLjQ1OSA3MC4zNTg1IDU4LjE0MzIgNzIuMjczOUM1NS44NTA2IDc0LjE3MDEgNTMuNDYxNCA3Ni4xMjg2IDUxLjE2MDMgNzguMTYxNkM0Ni41NTY0IDgyLjIyOTQgNDIuMDU0NCA4Ni44MDc4IDM4Ljc2OCA5Mi41TDQ1LjY5NjMgOTYuNVpNMTAuNzk5NCA3Mi40NjQ0QzEzLjA3MDUgNzQuNTQ1IDE1LjQ0MzQgNzYuNTI0IDE3Ljc1ODMgNzguNDM4N0MyMC4wOTY0IDgwLjM3MjUgMjIuMzYzNiA4Mi4yMzE0IDI0LjU0MyA4NC4xNTY5QzI4Ljg5OTkgODguMDA2NCAzMi42NTQzIDkxLjkxMDcgMzUuMzAzOSA5Ni41TDQyLjIzMjEgOTIuNUMzOC45NDU4IDg2LjgwNzggMzQuNDQzOCA4Mi4yMjk0IDI5LjgzOTkgNzguMTYxN0MyNy41Mzg5IDc2LjEyODYgMjUuMTQ5NiA3NC4xNzAyIDIyLjg1NyA3Mi4yNzRDMjAuNTQxMyA3MC4zNTg3IDE4LjMwOTMgNjguNDk0OCAxNi4yMDM1IDY2LjU2NTZMMTAuNzk5NCA3Mi40NjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIiBtYXNrPSJ1cmwoI3BhdGgtNC1pbnNpZGUtMV8xNzY1XzE3MzM1KSIvPgo8Y2lyY2xlIG9wYWNpdHk9IjAuNCIgY3g9IjQwLjUiIGN5PSI0MCIgcj0iMTIiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMTc2NV8xNzMzNSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzOS43NTggOTMuNjYwMykgcm90YXRlKDE4MCkgc2NhbGUoMTAuMjcyNiAyLjQ2MDc2KSI+CjxzdG9wLz4KPHN0b3Agb2Zmc2V0PSIwLjE1MjIzOCIgc3RvcC1jb2xvcj0iIzI0MjkyRiIvPgo8c3RvcCBvZmZzZXQ9IjAuNDYxODg4IiBzdG9wLWNvbG9yPSIjMTMxNjE5IiBzdG9wLW9wYWNpdHk9IjAuNTMyNTM0Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIwLjAxIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==";

const WaypointMarkerIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iMTAyIiB2aWV3Qm94PSIwIDAgODEgMTAyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6bXVsdGlwbHkiIG9wYWNpdHk9IjAuMjk5MjQ3Ij4KPGVsbGlwc2UgY3g9IjQwLjUwMDEiIGN5PSI5NC4xNjY1IiByeD0iMTguMzMzMyIgcnk9IjcuNSIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzE3NjVfMTczMzUpIi8+CjwvZz4KPHJlY3QgeD0iODAuNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIHRyYW5zZm9ybT0icm90YXRlKDkwIDgwLjUgMCkiIGZpbGw9IiMxOTg4Q0YiLz4KPHJlY3QgeD0iNzkiIHk9IjEuNSIgd2lkdGg9Ijc3IiBoZWlnaHQ9Ijc3IiByeD0iMzguNSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNzkgMS41KSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxtYXNrIGlkPSJwYXRoLTQtaW5zaWRlLTFfMTc2NV8xNzMzNSIgZmlsbD0id2hpdGUiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTY4Ljc4NDMgMTEuNzE1N0M1My4xNjMzIC0zLjkwNTI0IDI3LjgzNjcgLTMuOTA1MjQgMTIuMjE1NyAxMS43MTU3Qy0zLjQwNTI0IDI3LjMzNjcgLTMuNDA1MjQgNTIuNjYzMyAxMi4yMTU3IDY4LjI4NDNDMTIuNjM3NCA2OC43MDU5IDEzLjA2NiA2OS4xMTYxIDEzLjUwMTQgNjkuNTE1QzIyLjI1NTMgNzcuNTM0NiAzMi44MzIgODQuMjE4NSAzOC43NjggOTQuNUMzOS41Mzc4IDk1LjgzMzMgNDEuNDYyMyA5NS44MzMzIDQyLjIzMjIgOTQuNUM0OC4xNjgyIDg0LjIxODUgNTguNzQ0OSA3Ny41MzQ1IDY3LjQ5ODggNjkuNTE0OEM2Ny45MzQxIDY5LjExNiA2OC4zNjI3IDY4LjcwNTggNjguNzg0MyA2OC4yODQzQzg0LjQwNTIgNTIuNjYzMyA4NC40MDUyIDI3LjMzNjcgNjguNzg0MyAxMS43MTU3WiIvPgo8L21hc2s+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNjguNzg0MyAxMS43MTU3QzUzLjE2MzMgLTMuOTA1MjQgMjcuODM2NyAtMy45MDUyNCAxMi4yMTU3IDExLjcxNTdDLTMuNDA1MjQgMjcuMzM2NyAtMy40MDUyNCA1Mi42NjMzIDEyLjIxNTcgNjguMjg0M0MxMi42Mzc0IDY4LjcwNTkgMTMuMDY2IDY5LjExNjEgMTMuNTAxNCA2OS41MTVDMjIuMjU1MyA3Ny41MzQ2IDMyLjgzMiA4NC4yMTg1IDM4Ljc2OCA5NC41QzM5LjUzNzggOTUuODMzMyA0MS40NjIzIDk1LjgzMzMgNDIuMjMyMiA5NC41QzQ4LjE2ODIgODQuMjE4NSA1OC43NDQ5IDc3LjUzNDUgNjcuNDk4OCA2OS41MTQ4QzY3LjkzNDEgNjkuMTE2IDY4LjM2MjcgNjguNzA1OCA2OC43ODQzIDY4LjI4NDNDODQuNDA1MiA1Mi42NjMzIDg0LjQwNTIgMjcuMzM2NyA2OC43ODQzIDExLjcxNTdaIiBmaWxsPSIjMTk4OENGIi8+CjxwYXRoIGQ9Ik0xMi4yMTU3IDExLjcxNTdMMTUuMDQ0MiAxNC41NDQyTDEyLjIxNTcgMTEuNzE1N1pNNjguNzg0MyAxMS43MTU3TDY1Ljk1NTggMTQuNTQ0MlYxNC41NDQyTDY4Ljc4NDMgMTEuNzE1N1pNMTIuMjE1NyA2OC4yODQzTDkuMzg3MyA3MS4xMTI3SDkuMzg3M0wxMi4yMTU3IDY4LjI4NDNaTTM4Ljc2OCA5NC41TDM1LjMwMzkgOTYuNUwzNS4zMDQgOTYuNUwzOC43NjggOTQuNVpNMTUuMDQ0MiAxNC41NDQyQzI5LjEwMyAwLjQ4NTI4MSA1MS44OTcgMC40ODUyODIgNjUuOTU1OCAxNC41NDQyTDcxLjYxMjcgOC44ODczQzU0LjQyOTYgLTguMjk1NzcgMjYuNTcwNCAtOC4yOTU3NyA5LjM4NzMgOC44ODczTDE1LjA0NDIgMTQuNTQ0MlpNMTUuMDQ0MiA2NS40NTU4QzAuOTg1MjgyIDUxLjM5NyAwLjk4NTI4MiAyOC42MDMgMTUuMDQ0MiAxNC41NDQyTDkuMzg3MyA4Ljg4NzNDLTcuNzk1NzcgMjYuMDcwNCAtNy43OTU3NyA1My45Mjk2IDkuMzg3MyA3MS4xMTI3TDE1LjA0NDIgNjUuNDU1OFpNMTYuMjAzNSA2Ni41NjU2QzE1LjgxMTEgNjYuMjA2MSAxNS40MjQ1IDY1LjgzNjIgMTUuMDQ0MiA2NS40NTU4TDkuMzg3MyA3MS4xMTI3QzkuODUwMTkgNzEuNTc1NiAxMC4zMjEgNzIuMDI2MiAxMC43OTk0IDcyLjQ2NDRMMTYuMjAzNSA2Ni41NjU2Wk0zNS4zMDQgOTYuNUMzNy42MTMzIDEwMC41IDQzLjM4NjggMTAwLjUgNDUuNjk2MyA5Ni41TDM4Ljc2OCA5Mi41QzM5LjUzNzkgOTEuMTY2NiA0MS40NjI0IDkxLjE2NjcgNDIuMjMyMSA5Mi41TDM1LjMwNCA5Ni41Wk02NS45NTU4IDY1LjQ1NThDNjUuNTc1NSA2NS44MzYxIDY1LjE4OTEgNjYuMjA2IDY0Ljc5NjggNjYuNTY1NEw3MC4yMDA5IDcyLjQ2NDJDNzAuNjc5MSA3Mi4wMjYgNzEuMTQ5OSA3MS41NzU1IDcxLjYxMjcgNzEuMTEyN0w2NS45NTU4IDY1LjQ1NThaTTY1Ljk1NTggMTQuNTQ0MkM4MC4wMTQ3IDI4LjYwMyA4MC4wMTQ3IDUxLjM5NyA2NS45NTU4IDY1LjQ1NThMNzEuNjEyNyA3MS4xMTI3Qzg4Ljc5NTggNTMuOTI5NiA4OC43OTU4IDI2LjA3MDQgNzEuNjEyNyA4Ljg4NzNMNjUuOTU1OCAxNC41NDQyWk00NS42OTYzIDk2LjVDNDguMzQ1OSA5MS45MTA3IDUyLjEwMDMgODguMDA2NCA1Ni40NTczIDg0LjE1NjhDNTguNjM2NiA4Mi4yMzEyIDYwLjkwMzkgODAuMzcyNCA2My4yNDIgNzguNDM4NUM2NS41NTY5IDc2LjUyMzggNjcuOTI5OCA3NC41NDQ4IDcwLjIwMDkgNzIuNDY0Mkw2NC43OTY4IDY2LjU2NTRDNjIuNjkwOSA2OC40OTQ2IDYwLjQ1OSA3MC4zNTg1IDU4LjE0MzIgNzIuMjczOUM1NS44NTA2IDc0LjE3MDEgNTMuNDYxNCA3Ni4xMjg2IDUxLjE2MDMgNzguMTYxNkM0Ni41NTY0IDgyLjIyOTQgNDIuMDU0NCA4Ni44MDc4IDM4Ljc2OCA5Mi41TDQ1LjY5NjMgOTYuNVpNMTAuNzk5NCA3Mi40NjQ0QzEzLjA3MDUgNzQuNTQ1IDE1LjQ0MzQgNzYuNTI0IDE3Ljc1ODMgNzguNDM4N0MyMC4wOTY0IDgwLjM3MjUgMjIuMzYzNiA4Mi4yMzE0IDI0LjU0MyA4NC4xNTY5QzI4Ljg5OTkgODguMDA2NCAzMi42NTQzIDkxLjkxMDcgMzUuMzAzOSA5Ni41TDQyLjIzMjEgOTIuNUMzOC45NDU4IDg2LjgwNzggMzQuNDQzOCA4Mi4yMjk0IDI5LjgzOTkgNzguMTYxN0MyNy41Mzg5IDc2LjEyODYgMjUuMTQ5NiA3NC4xNzAyIDIyLjg1NyA3Mi4yNzRDMjAuNTQxMyA3MC4zNTg3IDE4LjMwOTMgNjguNDk0OCAxNi4yMDM1IDY2LjU2NTZMMTAuNzk5NCA3Mi40NjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIiBtYXNrPSJ1cmwoI3BhdGgtNC1pbnNpZGUtMV8xNzY1XzE3MzM1KSIvPgo8Y2lyY2xlIG9wYWNpdHk9IjAuNCIgY3g9IjQwLjUiIGN5PSI0MCIgcj0iMTIiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMTc2NV8xNzMzNSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzOS43NTggOTMuNjYwMykgcm90YXRlKDE4MCkgc2NhbGUoMTAuMjcyNiAyLjQ2MDc2KSI+CjxzdG9wLz4KPHN0b3Agb2Zmc2V0PSIwLjE1MjIzOCIgc3RvcC1jb2xvcj0iIzI0MjkyRiIvPgo8c3RvcCBvZmZzZXQ9IjAuNDYxODg4IiBzdG9wLWNvbG9yPSIjMTMxNjE5IiBzdG9wLW9wYWNpdHk9IjAuNTMyNTM0Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIwLjAxIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==";

const DestinationMarkerIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iMTAyIiB2aWV3Qm94PSIwIDAgODEgMTAyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6bXVsdGlwbHkiIG9wYWNpdHk9IjAuMjk5MjQ3Ij4KPGVsbGlwc2UgY3g9IjQwLjUwMDEiIGN5PSI5NC4xNjY1IiByeD0iMTguMzMzMyIgcnk9IjcuNSIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzE3ODFfMTc3NDIpIi8+CjwvZz4KPHJlY3QgeD0iODAuNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIHRyYW5zZm9ybT0icm90YXRlKDkwIDgwLjUgMCkiIGZpbGw9IiMxOTg4Q0YiLz4KPHJlY3QgeD0iNzkiIHk9IjEuNSIgd2lkdGg9Ijc3IiBoZWlnaHQ9Ijc3IiByeD0iMzguNSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNzkgMS41KSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxtYXNrIGlkPSJwYXRoLTQtaW5zaWRlLTFfMTc4MV8xNzc0MiIgZmlsbD0id2hpdGUiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTY4Ljc4NDMgMTEuNzE1N0M1My4xNjMzIC0zLjkwNTI0IDI3LjgzNjcgLTMuOTA1MjQgMTIuMjE1NyAxMS43MTU3Qy0zLjQwNTI0IDI3LjMzNjcgLTMuNDA1MjQgNTIuNjYzMyAxMi4yMTU3IDY4LjI4NDNDMTIuNjM3NCA2OC43MDU5IDEzLjA2NiA2OS4xMTYxIDEzLjUwMTQgNjkuNTE1QzIyLjI1NTMgNzcuNTM0NiAzMi44MzIgODQuMjE4NSAzOC43NjggOTQuNUMzOS41Mzc4IDk1LjgzMzMgNDEuNDYyMyA5NS44MzMzIDQyLjIzMjIgOTQuNUM0OC4xNjgyIDg0LjIxODUgNTguNzQ0OSA3Ny41MzQ1IDY3LjQ5ODggNjkuNTE0OEM2Ny45MzQxIDY5LjExNiA2OC4zNjI3IDY4LjcwNTggNjguNzg0MyA2OC4yODQzQzg0LjQwNTIgNTIuNjYzMyA4NC40MDUyIDI3LjMzNjcgNjguNzg0MyAxMS43MTU3WiIvPgo8L21hc2s+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNjguNzg0MyAxMS43MTU3QzUzLjE2MzMgLTMuOTA1MjQgMjcuODM2NyAtMy45MDUyNCAxMi4yMTU3IDExLjcxNTdDLTMuNDA1MjQgMjcuMzM2NyAtMy40MDUyNCA1Mi42NjMzIDEyLjIxNTcgNjguMjg0M0MxMi42Mzc0IDY4LjcwNTkgMTMuMDY2IDY5LjExNjEgMTMuNTAxNCA2OS41MTVDMjIuMjU1MyA3Ny41MzQ2IDMyLjgzMiA4NC4yMTg1IDM4Ljc2OCA5NC41QzM5LjUzNzggOTUuODMzMyA0MS40NjIzIDk1LjgzMzMgNDIuMjMyMiA5NC41QzQ4LjE2ODIgODQuMjE4NSA1OC43NDQ5IDc3LjUzNDUgNjcuNDk4OCA2OS41MTQ4QzY3LjkzNDEgNjkuMTE2IDY4LjM2MjcgNjguNzA1OCA2OC43ODQzIDY4LjI4NDNDODQuNDA1MiA1Mi42NjMzIDg0LjQwNTIgMjcuMzM2NyA2OC43ODQzIDExLjcxNTdaIiBmaWxsPSIjMTk4OENGIi8+CjxwYXRoIGQ9Ik0xMi4yMTU3IDExLjcxNTdMMTUuMDQ0MiAxNC41NDQyTDEyLjIxNTcgMTEuNzE1N1pNNjguNzg0MyAxMS43MTU3TDY1Ljk1NTggMTQuNTQ0MlYxNC41NDQyTDY4Ljc4NDMgMTEuNzE1N1pNMTIuMjE1NyA2OC4yODQzTDkuMzg3MyA3MS4xMTI3SDkuMzg3M0wxMi4yMTU3IDY4LjI4NDNaTTM4Ljc2OCA5NC41TDM1LjMwMzkgOTYuNUwzNS4zMDQgOTYuNUwzOC43NjggOTQuNVpNMTUuMDQ0MiAxNC41NDQyQzI5LjEwMyAwLjQ4NTI4MSA1MS44OTcgMC40ODUyODIgNjUuOTU1OCAxNC41NDQyTDcxLjYxMjcgOC44ODczQzU0LjQyOTYgLTguMjk1NzcgMjYuNTcwNCAtOC4yOTU3NyA5LjM4NzMgOC44ODczTDE1LjA0NDIgMTQuNTQ0MlpNMTUuMDQ0MiA2NS40NTU4QzAuOTg1MjgyIDUxLjM5NyAwLjk4NTI4MiAyOC42MDMgMTUuMDQ0MiAxNC41NDQyTDkuMzg3MyA4Ljg4NzNDLTcuNzk1NzcgMjYuMDcwNCAtNy43OTU3NyA1My45Mjk2IDkuMzg3MyA3MS4xMTI3TDE1LjA0NDIgNjUuNDU1OFpNMTYuMjAzNSA2Ni41NjU2QzE1LjgxMTEgNjYuMjA2MSAxNS40MjQ1IDY1LjgzNjIgMTUuMDQ0MiA2NS40NTU4TDkuMzg3MyA3MS4xMTI3QzkuODUwMTkgNzEuNTc1NiAxMC4zMjEgNzIuMDI2MiAxMC43OTk0IDcyLjQ2NDRMMTYuMjAzNSA2Ni41NjU2Wk0zNS4zMDQgOTYuNUMzNy42MTMzIDEwMC41IDQzLjM4NjggMTAwLjUgNDUuNjk2MyA5Ni41TDM4Ljc2OCA5Mi41QzM5LjUzNzkgOTEuMTY2NiA0MS40NjI0IDkxLjE2NjcgNDIuMjMyMSA5Mi41TDM1LjMwNCA5Ni41Wk02NS45NTU4IDY1LjQ1NThDNjUuNTc1NSA2NS44MzYxIDY1LjE4OTEgNjYuMjA2IDY0Ljc5NjggNjYuNTY1NEw3MC4yMDA5IDcyLjQ2NDJDNzAuNjc5MSA3Mi4wMjYgNzEuMTQ5OSA3MS41NzU1IDcxLjYxMjcgNzEuMTEyN0w2NS45NTU4IDY1LjQ1NThaTTY1Ljk1NTggMTQuNTQ0MkM4MC4wMTQ3IDI4LjYwMyA4MC4wMTQ3IDUxLjM5NyA2NS45NTU4IDY1LjQ1NThMNzEuNjEyNyA3MS4xMTI3Qzg4Ljc5NTggNTMuOTI5NiA4OC43OTU4IDI2LjA3MDQgNzEuNjEyNyA4Ljg4NzNMNjUuOTU1OCAxNC41NDQyWk00NS42OTYzIDk2LjVDNDguMzQ1OSA5MS45MTA3IDUyLjEwMDMgODguMDA2NCA1Ni40NTczIDg0LjE1NjhDNTguNjM2NiA4Mi4yMzEyIDYwLjkwMzkgODAuMzcyNCA2My4yNDIgNzguNDM4NUM2NS41NTY5IDc2LjUyMzggNjcuOTI5OCA3NC41NDQ4IDcwLjIwMDkgNzIuNDY0Mkw2NC43OTY4IDY2LjU2NTRDNjIuNjkwOSA2OC40OTQ2IDYwLjQ1OSA3MC4zNTg1IDU4LjE0MzIgNzIuMjczOUM1NS44NTA2IDc0LjE3MDEgNTMuNDYxNCA3Ni4xMjg2IDUxLjE2MDMgNzguMTYxNkM0Ni41NTY0IDgyLjIyOTQgNDIuMDU0NCA4Ni44MDc4IDM4Ljc2OCA5Mi41TDQ1LjY5NjMgOTYuNVpNMTAuNzk5NCA3Mi40NjQ0QzEzLjA3MDUgNzQuNTQ1IDE1LjQ0MzQgNzYuNTI0IDE3Ljc1ODMgNzguNDM4N0MyMC4wOTY0IDgwLjM3MjUgMjIuMzYzNiA4Mi4yMzE0IDI0LjU0MyA4NC4xNTY5QzI4Ljg5OTkgODguMDA2NCAzMi42NTQzIDkxLjkxMDcgMzUuMzAzOSA5Ni41TDQyLjIzMjEgOTIuNUMzOC45NDU4IDg2LjgwNzggMzQuNDQzOCA4Mi4yMjk0IDI5LjgzOTkgNzguMTYxN0MyNy41Mzg5IDc2LjEyODYgMjUuMTQ5NiA3NC4xNzAyIDIyLjg1NyA3Mi4yNzRDMjAuNTQxMyA3MC4zNTg3IDE4LjMwOTMgNjguNDk0OCAxNi4yMDM1IDY2LjU2NTZMMTAuNzk5NCA3Mi40NjQ0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIiBtYXNrPSJ1cmwoI3BhdGgtNC1pbnNpZGUtMV8xNzgxXzE3NzQyKSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI2Ljc1IDUyLjI1QzI2LjQxODUgNTIuMjUgMjYuMTAwNSA1Mi4xMTgzIDI1Ljg2NjEgNTEuODgzOUMyNS42MzE3IDUxLjY0OTUgMjUuNSA1MS4zMzE1IDI1LjUgNTFWMjlDMjUuNSAyOC42Njg1IDI1LjYzMTcgMjguMzUwNSAyNS44NjYxIDI4LjExNjFDMjYuMTAwNSAyNy44ODE3IDI2LjQxODUgMjcuNzUgMjYuNzUgMjcuNzVDMjcuMDgxNSAyNy43NSAyNy4zOTk1IDI3Ljg4MTcgMjcuNjMzOSAyOC4xMTYxQzI3Ljg2ODMgMjguMzUwNSAyOCAyOC42Njg1IDI4IDI5VjUxQzI4IDUxLjMzMTUgMjcuODY4MyA1MS42NDk1IDI3LjYzMzkgNTEuODgzOUMyNy4zOTk1IDUyLjExODMgMjcuMDgxNSA1Mi4yNSAyNi43NSA1Mi4yNVpNNTQuMjUgNTIuMjVDNTMuOTE4NSA1Mi4yNSA1My42MDA1IDUyLjExODMgNTMuMzY2MSA1MS44ODM5QzUzLjEzMTcgNTEuNjQ5NSA1MyA1MS4zMzE1IDUzIDUxVjI5QzUzIDI4LjY2ODUgNTMuMTMxNyAyOC4zNTA1IDUzLjM2NjEgMjguMTE2MUM1My42MDA1IDI3Ljg4MTcgNTMuOTE4NSAyNy43NSA1NC4yNSAyNy43NUM1NC41ODE1IDI3Ljc1IDU0Ljg5OTUgMjcuODgxNyA1NS4xMzM5IDI4LjExNjFDNTUuMzY4MyAyOC4zNTA1IDU1LjUgMjguNjY4NSA1NS41IDI5VjUxQzU1LjUgNTEuMzMxNSA1NS4zNjgzIDUxLjY0OTUgNTUuMTMzOSA1MS44ODM5QzU0Ljg5OTUgNTIuMTE4MyA1NC41ODE1IDUyLjI1IDU0LjI1IDUyLjI1Wk0zMCAzMEg1MVYzOUgzMFYzMFoiIGZpbGw9IiNGNEY1RjYiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8xNzgxXzE3NzQyIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDM5Ljc1OCA5My42NjAzKSByb3RhdGUoMTgwKSBzY2FsZSgxMC4yNzI2IDIuNDYwNzYpIj4KPHN0b3AvPgo8c3RvcCBvZmZzZXQ9IjAuMTUyMjM4IiBzdG9wLWNvbG9yPSIjMjQyOTJGIi8+CjxzdG9wIG9mZnNldD0iMC40NjE4ODgiIHN0b3AtY29sb3I9IiMxMzE2MTkiIHN0b3Atb3BhY2l0eT0iMC41MzI1MzQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuMDEiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K";

const defaultIconConfig = {
  width: 38,
  height: 48,
  anchor: "bottom"
};

export const getIconForFeature = (index, totalFeatures) => {
  let iconUrl = WaypointMarkerIcon;
  if (index === 0) {
    iconUrl = LocationMarkerIcon;
  } else if (index === totalFeatures - 1) {
    iconUrl = DestinationMarkerIcon;
  }

  return {
    url: iconUrl,
    ...defaultIconConfig
  };
};

export const processRouteFeatures = (data) => {
  const featureCollection =
    data?.type === "FeatureCollection"
      ? data
      : { type: "FeatureCollection", features: data };

  return featureCollection.features.map((feature, index, allFeatures) => {
    if (feature.geometry.type === "Point" && !feature.properties.icon) {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          icon: getIconForFeature(index, allFeatures.length)
        }
      };
    }
    return feature;
  });
};
