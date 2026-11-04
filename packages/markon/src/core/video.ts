/**
 * @nofinite/markon - Custom Video & Media Embed Engine
 * Framework-agnostic TipTap extension supporting YouTube, Vimeo, and direct video URLs.
 * 100% styled with @nofinite/nuicss tokens and responsive aspect-video layout.
 */

import { mergeAttributes, Node } from '@tiptap/core';
import { openMarkonModal } from './dialog';
import { sanitizeUrl } from './security';

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoBlock: {
      setVideo: (options: {
        src: string;
        alignment?: 'left' | 'center' | 'right';
      }) => ReturnType;
    };
  }
}

export function isAllowedVideoEmbedUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:')
      return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'www.youtube-nocookie.com' ||
      host === 'youtube-nocookie.com' ||
      host === 'www.youtube.com' ||
      host === 'youtube.com' ||
      host === 'youtu.be' ||
      host === 'player.vimeo.com' ||
      host === 'www.vimeo.com' ||
      host === 'vimeo.com'
    );
  } catch {
    return false;
  }
}

export function parseVideoUrl(url: string): {
  service: 'youtube' | 'vimeo' | 'custom';
  embedUrl: string;
} {
  const trimmed = url.trim();

  try {
    const parsed = new URL(
      trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    );
    const host = parsed.hostname.toLowerCase();

    // youtu.be/<id>
    if (host === 'youtu.be' || host.endsWith('.youtu.be')) {
      const id = parsed.pathname.slice(1).split('/')[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return {
          service: 'youtube',
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        };
      }
    }

    // youtube.com
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return {
          service: 'youtube',
          embedUrl: `https://www.youtube-nocookie.com/embed/${v}`,
        };
      }
      const parts = parsed.pathname.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1];
      if (lastPart && /^[a-zA-Z0-9_-]{11}$/.test(lastPart)) {
        return {
          service: 'youtube',
          embedUrl: `https://www.youtube-nocookie.com/embed/${lastPart}`,
        };
      }
    }

    // vimeo.com/<id>
    if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      const id = parts[parts.length - 1];
      if (id && /^\d+$/.test(id)) {
        return {
          service: 'vimeo',
          embedUrl: `https://player.vimeo.com/video/${id}`,
        };
      }
    }
  } catch {
    // Fallback if URL constructor fails
  }

  // Custom direct video (mp4, webm, etc.) or raw video link
  return {
    service: 'custom',
    embedUrl: sanitizeUrl(trimmed),
  };
}

export const VideoBlock = Node.create<VideoOptions>({
  name: 'videoBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: '',
      },
      service: {
        default: 'custom',
      },
      alignment: {
        default: 'center',
      },
      width: {
        default: '100%',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-block]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          return {
            src: element.getAttribute('data-src') || '',
            service: element.getAttribute('data-service') || 'custom',
            alignment: element.getAttribute('data-alignment') || 'center',
            width: element.getAttribute('data-width') || '100%',
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, service, alignment, width } = node.attrs;
    const alignClass =
      alignment === 'left'
        ? 'mr-auto'
        : alignment === 'right'
        ? 'ml-auto'
        : 'mx-auto';

    return [
      'div',
      mergeAttributes(
        {
          'data-video-block': '',
          'data-src': src,
          'data-service': service,
          'data-alignment': alignment,
          'data-width': width,
          class: `markon-video-block my-4 ${alignClass}`,
          style: `width: ${width}; max-width: 100%;`,
        },
        HTMLAttributes
      ),
      service === 'custom'
        ? [
            'video',
            {
              src: sanitizeUrl(src),
              controls: 'true',
              playsinline: 'true',
              class:
                'w-full aspect-video rounded-xl border border-default bg-subtle object-cover shadow-sm',
            },
          ]
        : isAllowedVideoEmbedUrl(src)
        ? [
            'iframe',
            {
              src,
              class:
                'w-full aspect-video rounded-xl border border-default shadow-sm',
              frameborder: '0',
              sandbox:
                'allow-scripts allow-same-origin allow-presentation allow-popups',
              allow:
                'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
              allowfullscreen: 'true',
            },
          ]
        : [
            'div',
            {
              class:
                'w-full aspect-video rounded-xl border border-default bg-subtle flex items-center justify-center text-muted text-sm',
            },
            'Invalid video source',
          ],
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ chain }) => {
          const { service, embedUrl } = parseVideoUrl(options.src);
          return chain()
            .insertContent({
              type: this.name,
              attrs: {
                src: embedUrl,
                service,
                alignment: options.alignment || 'center',
              },
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      let currentNode = node;
      const container = document.createElement('div');
      container.className =
        'markon-video-block relative group/video my-4 select-none';
      container.setAttribute('data-video-block', '');

      const applyAlignment = (align: string) => {
        container.classList.remove('mr-auto', 'ml-auto', 'mx-auto');
        if (align === 'left') container.classList.add('mr-auto');
        else if (align === 'right') container.classList.add('ml-auto');
        else container.classList.add('mx-auto');
      };

      applyAlignment(node.attrs.alignment || 'center');
      container.style.width = node.attrs.width || '100%';
      container.style.maxWidth = '100%';

      // Video Wrapper
      const mediaWrapper = document.createElement('div');
      mediaWrapper.className =
        'relative aspect-video w-full rounded-xl overflow-hidden border border-default bg-subtle shadow-sm';

      const renderPlayer = (src: string, service: string) => {
        mediaWrapper.innerHTML = '';
        if (service === 'custom') {
          const video = document.createElement('video');
          video.src = sanitizeUrl(src);
          video.controls = true;
          video.playsInline = true;
          video.className = 'w-full h-full object-cover';
          mediaWrapper.appendChild(video);
        } else if (isAllowedVideoEmbedUrl(src)) {
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.className = 'w-full h-full border-none';
          iframe.setAttribute(
            'sandbox',
            'allow-scripts allow-same-origin allow-presentation allow-popups'
          );
          iframe.allow =
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
          iframe.allowFullscreen = true;
          mediaWrapper.appendChild(iframe);
        } else {
          const placeholder = document.createElement('div');
          placeholder.className =
            'w-full h-full flex items-center justify-center text-muted text-sm';
          placeholder.textContent = 'Invalid video source';
          mediaWrapper.appendChild(placeholder);
        }
      };

      renderPlayer(node.attrs.src, node.attrs.service);
      container.appendChild(mediaWrapper);

      // In editable mode, add floating action overlay for alignment and deletion
      if (editor.isEditable) {
        const toolbar = document.createElement('div');
        toolbar.className =
          'absolute top-2 right-2 flex items-center gap-1 p-1 rounded-lg bg-surface/90 border border-default shadow-md opacity-0 group-hover/video:opacity-100 focus-within:opacity-100 transition-opacity z-10';

        const createBtn = (
          icon: string,
          title: string,
          onClick: () => void
        ) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className =
            'btn btn-ghost btn-xs btn-icon text-muted hover:text-default';
          btn.title = title;
          btn.innerHTML = icon;
          btn.addEventListener('mousedown', (e) => e.preventDefault());
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          });
          return btn;
        };

        // Align left
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
            'Align Left',
            () => {
              if (typeof getPos === 'function') {
                const pos = getPos();
                if (typeof pos === 'number') {
                  editor.view.dispatch(
                    editor.view.state.tr.setNodeMarkup(pos, undefined, {
                      ...currentNode.attrs,
                      alignment: 'left',
                    })
                  );
                }
              }
            }
          )
        );

        // Align center
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="18" y1="18" x2="6" y2="18"/></svg>',
            'Align Center',
            () => {
              if (typeof getPos === 'function') {
                const pos = getPos();
                if (typeof pos === 'number') {
                  editor.view.dispatch(
                    editor.view.state.tr.setNodeMarkup(pos, undefined, {
                      ...currentNode.attrs,
                      alignment: 'center',
                    })
                  );
                }
              }
            }
          )
        );

        // Align right
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>',
            'Align Right',
            () => {
              if (typeof getPos === 'function') {
                const pos = getPos();
                if (typeof pos === 'number') {
                  editor.view.dispatch(
                    editor.view.state.tr.setNodeMarkup(pos, undefined, {
                      ...currentNode.attrs,
                      alignment: 'right',
                    })
                  );
                }
              }
            }
          )
        );

        // Edit URL
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
            'Edit Video URL',
            () => {
              openMarkonModal({
                title: 'Edit Video URL',
                label: 'YouTube, Vimeo, or Video URL',
                initialValue: currentNode.attrs.src,
                placeholder: 'https://youtube.com/watch?v=...',
                confirmText: 'Update Video',
                onConfirm: (val) => {
                  if (val && typeof getPos === 'function') {
                    const pos = getPos();
                    if (typeof pos === 'number') {
                      const { service, embedUrl } = parseVideoUrl(val);
                      editor.view.dispatch(
                        editor.view.state.tr.setNodeMarkup(pos, undefined, {
                          ...currentNode.attrs,
                          src: embedUrl,
                          service,
                        })
                      );
                    }
                  }
                  editor.commands.focus();
                },
                onCancel: () => {
                  editor.commands.focus();
                },
              });
            }
          )
        );

        // Delete button
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
            'Remove Video',
            () => {
              if (typeof getPos === 'function') {
                const pos = getPos();
                if (typeof pos === 'number') {
                  editor.view.dispatch(
                    editor.view.state.tr.delete(pos, pos + 1)
                  );
                }
              }
            }
          )
        );

        container.appendChild(toolbar);
      }

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'videoBlock') return false;
          const prevAttrs = currentNode.attrs;
          currentNode = updatedNode;
          applyAlignment(updatedNode.attrs.alignment || 'center');
          container.style.width = updatedNode.attrs.width || '100%';
          if (
            updatedNode.attrs.src !== prevAttrs.src ||
            updatedNode.attrs.service !== prevAttrs.service
          ) {
            renderPlayer(updatedNode.attrs.src, updatedNode.attrs.service);
          }
          return true;
        },
      };
    };
  },
});
