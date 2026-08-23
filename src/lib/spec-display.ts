/**
 * 사양표에 실제로 보여줄 값만 골라냅니다.
 *
 * 제품 데이터에는 값을 모르는 칸이 "확인 필요", "제조사 사양 확인 필요"처럼
 * 자리 채우기 문구로 들어옵니다. 표에 그대로 깔면 읽는 사람 입장에서는
 * 알맹이 없는 줄만 늘어나므로, 화면에서는 아예 빼거나 "—"로 둡니다.
 */
const UNKNOWN = /(확인 필요|확인해야 함|미확인|미공개|정보 없음)$/;

export function isKnownSpec(value: string | undefined): value is string {
  return Boolean(value) && !UNKNOWN.test(value!.trim());
}

export function knownSpecs(specs: Record<string, string>): [string, string][] {
  return Object.entries(specs).filter(([, value]) => isKnownSpec(value));
}

/** 필터 목록에서도 같은 자리 채우기 값을 걸러 냅니다. */
export function knownOptions(values: string[]): string[] {
  return values.filter(isKnownSpec);
}
