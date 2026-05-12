#!/usr/bin/env node
/**
 * iPhone「位置情報サービス切替」ショートカット セットアップガイド生成スクリプト
 *
 * このスクリプトはショートカットのアクション定義をコンソールに出力します。
 * iOS Shortcutsアプリの制約により、位置情報サービスを直接ON/OFFすることは
 * できませんが、設定画面への直接リンクをショートカットとして作成できます。
 */

const SHORTCUT_ACTIONS = {
  simple: {
    name: '位置情報設定を開く（シンプル版）',
    description: '設定アプリの位置情報サービス画面を直接開きます',
    actions: [
      {
        step: 1,
        action: 'URLを開く',
        category: 'Web',
        value: 'App-Prefs:root=Privacy&path=LOCATION',
        note: '設定アプリの位置情報サービス画面を開く',
      },
    ],
  },
  advanced: {
    name: '位置情報サービス切替（状態確認版）',
    description: '現在の位置情報サービスの状態を確認してから設定画面を開きます',
    actions: [
      {
        step: 1,
        action: '現在地を取得',
        category: '位置情報',
        value: null,
        note: '位置情報サービスの状態チェックに使用',
      },
      {
        step: 2,
        action: 'if（もし）',
        category: 'スクリプティング',
        condition: '現在地 が ある',
        trueBranch: [
          {
            action: '結果を表示',
            value: '✅ 位置情報サービスは ON です\n設定でOFFにできます。',
          },
          {
            action: 'URLを開く',
            value: 'App-Prefs:root=Privacy&path=LOCATION',
          },
        ],
        falseBranch: [
          {
            action: '結果を表示',
            value: '❌ 位置情報サービスはOFF（または未許可）です\n設定でONにできます。',
          },
          {
            action: 'URLを開く',
            value: 'App-Prefs:root=Privacy&path=LOCATION',
          },
        ],
      },
    ],
  },
};

const SETTINGS_URLS = [
  { url: 'App-Prefs:root=Privacy&path=LOCATION', description: '位置情報サービス設定（推奨）' },
  { url: 'prefs:root=Privacy&path=LOCATION', description: '位置情報サービス設定（代替）' },
];

function printSeparator(char = '─', length = 60) {
  console.log(char.repeat(length));
}

function printShortcutGuide(type) {
  const shortcut = SHORTCUT_ACTIONS[type];
  console.log(`\n📱 ${shortcut.name}`);
  console.log(`   ${shortcut.description}`);
  printSeparator();

  shortcut.actions.forEach((action) => {
    if (action.step !== undefined) {
      console.log(`\nステップ ${action.step}: 【${action.action}】（${action.category}）`);
    }

    if (action.value) {
      console.log(`  設定値: ${action.value}`);
    }
    if (action.note) {
      console.log(`  補足: ${action.note}`);
    }
    if (action.condition) {
      console.log(`  条件: ${action.condition}`);
    }

    if (action.trueBranch) {
      console.log('\n  ✓ ONの場合:');
      action.trueBranch.forEach((a) => {
        console.log(`    - ${a.action}: ${a.value}`);
      });
    }

    if (action.falseBranch) {
      console.log('\n  ✗ OFFまたは取得失敗の場合:');
      action.falseBranch.forEach((a) => {
        console.log(`    - ${a.action}: ${a.value}`);
      });
    }
  });
}

function main() {
  console.log('');
  printSeparator('═');
  console.log('  iPhone 位置情報サービス切替ショートカット セットアップガイド');
  printSeparator('═');

  console.log('\n⚠️  iOSの制約について:');
  console.log('   iOS Shortcutsからシステムの位置情報サービスを直接ON/OFFする');
  console.log('   APIは提供されていません。このショートカットは設定画面を開き、');
  console.log('   ユーザーがワンタップで切替できるよう補助します。');

  printSeparator();
  console.log('\n【作成できるショートカットの種類】');

  console.log('\n1. シンプル版（推奨）');
  console.log('   位置情報設定を直接開くだけ。最もシンプルで確実。');

  console.log('\n2. 状態確認版');
  console.log('   現在のON/OFF状態を確認してから設定画面を開く。');

  printSeparator();

  printShortcutGuide('simple');
  printShortcutGuide('advanced');

  printSeparator();
  console.log('\n📎 使用するURL設定:');
  SETTINGS_URLS.forEach((item) => {
    console.log(`  ${item.url}`);
    console.log(`  → ${item.description}`);
  });

  console.log('\n📖 詳細な手順: shortcuts/SETUP.md を参照してください');
  printSeparator('═');
}

main();
