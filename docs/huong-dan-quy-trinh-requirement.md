# Hướng dẫn quy trình Requirement cho Dev Toolbox

Tài liệu này mô tả quy trình từ ý tưởng tính năng đến requirement đã được delivery.

## Chọn đúng skill

| Công việc | Skill |
| --- | --- |
| Tạo tool hoặc product feature mới | `build-dev-tool-feature` |
| Đồng bộ một hoặc nhiều screen Stitch vào app | `stitch-screen-sync` |
| Tinh chỉnh một route để khớp screenshot Stitch | `stitch-screen-improve` |

Với tool mới, bắt đầu bằng `build-dev-tool-feature`. Dùng Stitch skills khi công việc dựa trên một
screen Stitch đã tồn tại.

## Các trạng thái

```text
design-draft -> design-review -> design-approved -> implementing -> delivered
```

| Trạng thái | Ý nghĩa |
| --- | --- |
| `design-draft` | Đang chuẩn bị feature brief và requirement. |
| `design-review` | Đã có thiết kế Stitch và đang chờ feedback/approval; không được implement code. |
| `design-approved` | Người dùng đã phê duyệt UI mới nhất rõ ràng. |
| `implementing` | Đang thay đổi code, tests và data layer cần thiết. |
| `delivered` | Checks và delivery evidence đã hoàn tất. |

Nếu screen Stitch thay đổi sau approval, đưa requirement về `design-review` và xin approval lại.

## 1. Tạo requirement

1. Thu thập tên feature, user outcome, inputs, outputs, actions, validation, data needs, route và design notes.
2. Tìm ID tiếp theo trong `requirements/`.
3. Tạo `requirements/<id>-<feature-slug>.md` với `status: design-draft`.
4. Ghi plan ngắn vào `docs/task-log.md`.

```yaml
---
id: REQ-009
status: design-draft
route: /tools/example
stitch_project: Dev Toolbox
stitch_screen_id:
stitch_screen_title:
ui_approved_at:
---
```

Requirement cần có Goal, Inputs, Outputs, Main actions, Validation, Data, Acceptance criteria và Non-goals.

## 2. Thiết kế trên Stitch

Resolve Dev Toolbox project bằng cách list project, không hard-code project ID. Generate screen có
shared shell, inputs, output, actions, validation và empty/error/success states. Inspect screen,
ghi ID/title vào requirement, rồi chuyển sang `design-review`.

Chỉ `Approve UI`, `UI approved` hoặc `Approve and build` mới là approval hợp lệ.

## 3. Implement sau approval

Retrieve screen Stitch mới nhất, đặt `ui_approved_at`, chuyển sang `design-approved`, rồi sang
`implementing` khi bắt đầu đổi code.

```text
app/(toolbox)/tools/<tool>/page.tsx       Route page mỏng
features/<tool>/<tool>.ts                 Logic thuần
features/<tool>/<tool>.client.tsx         Tương tác browser
features/<tool>/<tool>.test.ts            Unit tests
```

Cập nhật `lib/tools.ts` nếu tool cần xuất hiện trong discovery/navigation. Không copy nguyên HTML
từ Stitch; screenshot là nguồn tham chiếu UI.

## 4. Data và bảo mật

- Ưu tiên xử lý local trong browser.
- Tái sử dụng Saved Runs khi phù hợp.
- Validate server input bằng Zod và giữ `SUPABASE_SERVICE_ROLE_KEY` chỉ ở server.
- Tạo migration timestamp mới cho schema change; không sửa migration đã apply.
- Không commit `.env*`, token, credentials hoặc generated temporary configuration.

## 5. Format có scope và checks

Format bắt buộc nhưng chỉ cho file liên quan feature: route, feature folder, tests và shared file
được chủ động chỉnh như `lib/tools.ts` hoặc `app/globals.css`.

```bash
npx prettier --write <feature-related-paths>
npx prettier --check <feature-related-paths>
npm run check
```

Không format toàn repository cho feature nhỏ nếu không được yêu cầu. Review diff để tìm secrets,
file vô tình thêm, thay đổi không liên quan và thiếu requirement coverage.

## 6. Delivery

Chạy checks, tạo branch/PR khi khả dụng và validate Vercel Preview. Chỉ đặt `delivered` khi có
checks và delivery evidence. Production deployment hoặc production migration cần approval riêng.

## Báo cáo cuối

Báo cáo requirement path/status, Stitch project/screen/route, acceptance-criteria evidence, files
changed, migration impact, checks, PR/preview URL và mọi rủi ro hoặc blocker còn lại.
