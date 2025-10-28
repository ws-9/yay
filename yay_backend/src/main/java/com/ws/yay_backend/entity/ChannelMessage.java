package com.ws.yay_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "channel_messages")
public class ChannelMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "message", nullable = false)
  private String message;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "channel_id", nullable = false)
  private Channel channel;

  public ChannelMessage() {}

  public ChannelMessage(String message, User user, Channel channel) {
    this.message = message;
    this.user = user;
    this.channel = channel;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Channel getChannel() {
    return channel;
  }

  public void setChannel(Channel channel) {
    this.channel = channel;
  }
}
