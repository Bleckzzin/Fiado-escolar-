# Fiado Escolar — projeto para gerar o APK

O sistema roda dentro de um app Android (Capacitor). Funciona sem internet e os dados ficam no aparelho.
**Não consegui gerar o APK no ambiente onde preparei o projeto** (sem internet nem Android SDK). Tudo está configurado, mas a primeira compilação acontece no seu GitHub ou no seu computador.

## Opção A — sem instalar nada: GitHub gera o APK
1. Crie uma conta em github.com e um repositório **privado** novo (a chave de assinatura vai junto no projeto).
2. Envie **todo o conteúdo desta pasta** para o repositório, incluindo a pasta oculta `.github` (pelo computador, use "Add file → Upload files" e arraste tudo, ou use o git).
3. Abra a aba **Actions → Gerar APK → Run workflow**. Leva uns 5 a 10 minutos.
4. Quando terminar, baixe o `fiado-escolar.apk` na seção **Releases** do repositório (ou no resultado da execução, em "Artifacts").
5. Copie o APK para o celular, abra e permita "instalar apps desconhecidos" quando o Android pedir.

## Opção B — no seu computador
Precisa de Node 22+, JDK 21 e Android Studio (para o Android SDK).
```
npm install
npx cap add android
npx capacitor-assets generate --android
node scripts/patch-android.mjs
npx cap sync android
cd android && ./gradlew assembleRelease
```
O APK sai em `android/app/build/outputs/apk/release/app-release.apk`. (No Windows use `gradlew.bat`.)

## Cuidados importantes com os dados
- Os dados ficam dentro do app. **Desinstalar o app ou limpar os dados dele apaga tudo.** Exporte backups com frequência (Mais → Configurações e backup).
- Para **atualizar** o app, instale o APK novo por cima, sem desinstalar. Isso só funciona porque todas as versões são assinadas com a mesma chave (`fiado-release.p12`). **Guarde esse arquivo** e não o troque.
- O APK é um app novo para o Android, então ele não enxerga os dados do sistema que você usava no navegador. Para passar os dados: no sistema antigo, Exportar backup; no app, Importar backup.
- Exportar backup e a lista de devedores abre a tela de compartilhar do Android (Drive, WhatsApp, e-mail, Arquivos…).
- O botão voltar do Android navega pelo app e só fecha na tela Início.

## Se der erro
- `Formato inesperado do build.gradle`: a versão do Capacitor gerou um arquivo diferente do previsto. Abra `android/app/build.gradle` e adicione manualmente o bloco `signingConfigs` e o `signingConfig` nos tipos `release` (copie de `scripts/patch-android.mjs`).
- A cor dos ícones da barra de status pode precisar de ajuste (`SystemBars.style` em `capacitor.config.json`: `DARK` ou `LIGHT`).
- Para mudar nome ou ícone: `appName` em `capacitor.config.json` e as imagens da pasta `assets/`.
